
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
	lda #$d1
	sta ppu_data
	lda seconds_tens
	adc #$80
	sta ppu_data
	lda seconds_ones
	adc #$80
	sta ppu_data
	lda #$be
	sta ppu_data
	lda frames_tens
	adc #$80
	sta ppu_data
	lda frames_ones
	adc #$80
	sta ppu_data

	lda #$00
	sta ppu_scroll
	sta ppu_scroll

	inc wtf
	bne .not_next
	inc wtf_hi
	lda wtf_hi
	cmp #$04
	bne .not_next
	lda #$00
	sta wtf_hi
	inc song_id
	lda song_id
	and #$03
	sta song_id
	jsr init_track
.not_next

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
.wait_loop
	nop
	nop
	nop
	nop
	dex
	bne .wait_loop

	lda #%00011001
	sta ppu_mask

	jsr update_track

	lda #%00011000
	sta ppu_mask

	rti



update_track: subroutine
	jmp (play_ptr_lo)
