/*
	BANK Abstract Generic


	generic track init for banks
*/

	processor 6502

	include "./define.asm"


	org bankag_addr

bank_init: subroutine
	; titlet display
	lda #$00
	sta ppu_ctrl
	sta ppu_mask
	lda #$20
	sta ppu_addr
	lda #$c4
	sta ppu_addr
	ldx #$00
.titlet_loop
	lda titlet_table,x
	sta ppu_data
	inx
	cpx #$20
	bne .titlet_loop
	lda #%10010000
	sta ppu_ctrl
	lda #%00011000
	sta ppu_mask

	rts



	; NMI
	org bankag_addr+$80

bank_update: subroutine
	; time_display
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

	; wtf_display
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

	; timer
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

	rts


update_track: subroutine
	jmp (play_nsf_lo)

