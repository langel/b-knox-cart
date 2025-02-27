
; NMI

update: subroutine

time_display
	lda #$21
	sta ppu_addr
	lda #$24
	sta ppu_addr
	clc
	lda minutes_tens
	adc #$80
	sta ppu_data
	lda minutes_ones
	adc #$80
	sta ppu_data
	lda #$d2 ; ':'
	sta ppu_data
	lda seconds_tens
	adc #$80
	sta ppu_data
	lda seconds_ones
	adc #$80
	sta ppu_data
	lda #$bf ; '.'
	sta ppu_data
	lda frames_tens
	adc #$80
	sta ppu_data
	lda frames_ones
	adc #$80
	sta ppu_data
wtf_display
	lda #$00
	sta ppu_data
	sta ppu_data
	lda wtf_hi
	lsr
	lsr
	lsr
	lsr
	clc
	adc #$80
	sta ppu_data
	lda wtf_hi
	and #$0f
	adc #$80
	sta ppu_data
	lda wtf
	lsr
	lsr
	lsr
	lsr
	clc
	adc #$80
	sta ppu_data
	lda wtf
	and #$0f
	adc #$80
	sta ppu_data

	lda #$00
	sta ppu_scroll
	sta ppu_scroll

	lda wtf
	cmp length_lo
	bne .not_forced_next
	lda wtf_hi
	cmp length_hi
	bne .not_forced_next
	inc song_id
	lda song_id
	and #$0f
	sta song_id
	jsr init_track
.not_forced_next
	inc wtf
	bne .not_wtf_hi
	inc wtf_hi
.not_wtf_hi

	lda controls_d
	beq .not_controlled_next
	inc song_id
	lda song_id
	and #$0f
	sta song_id
	lda #$00
	sta controls_d
	jsr init_track
.not_controlled_next

timer
	inc frames_ones
	lda frames_ones
	cmp #$0a
	bne .timer_done
	lda #$00
	sta frames_ones
	inc frames_tens
	lda frames_tens
	cmp #$06
	bne .timer_done
	lda #$00
	sta frames_tens
	inc seconds_ones
	lda seconds_ones
	cmp #$0a
	bne .timer_done
	lda #$00
	sta seconds_ones
	inc seconds_tens
	lda seconds_tens
	cmp #$06
	bne .timer_done
	lda #$00
	sta seconds_tens
	inc minutes_ones
	lda minutes_ones
	cmp #$0a
	bne .timer_done
	lda #$00
	sta minutes_ones
	inc minutes_tens
.timer_done

	ldx #$00
	ldy #$05
.wait_loop
	nop
	nop
	nop
	dex
	bne .wait_loop
	dey
	bpl .wait_loop

	lda #%00011001
	sta ppu_mask

	jsr update_track

	lda #%00011000
	sta ppu_mask

	jsr controller_read

	rti



update_track: subroutine
	jmp (play_ptr_lo)



controller_poller: subroutine
	ldx #$01
	stx joypad1
	dex
	stx joypad1
	ldx #$08
.read_loop
	lda joypad1
	lsr
	rol temp00
	lsr
	rol temp01
	dex
	bne .read_loop
	lda temp00
	ora temp01
	sta temp00
	rts

controller_read: subroutine
	jsr controller_poller
.checksum_loop
	ldy temp00
	jsr controller_poller
	cpy temp00
	bne .checksum_loop
	lda temp00
	tay
	eor controls
	and temp00
	sta controls_d
	sty controls
	rts
