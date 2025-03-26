/*
	BANK Abstract Generic


	generic track init for banks
*/

	processor 6502

	include "./define.asm"


	org bankag_addr

bank_init: subroutine

	; palette gen
	lda #$3f
	sta ppu_addr
	lda #$00
	sta ppu_addr
	ldx #$08
	ldy #$05
.pal_loop
	lda #$0c
	sta ppu_data
	tya
	clc
	adc #$10
	sta ppu_data
	adc #$10
	sta ppu_data
	adc #$10
	sta ppu_data
	iny
	dex
	bne .pal_loop

	; clear screen
	lda #$20
	sta ppu_addr
	lda #$00
	sta ppu_addr
	tax
	tay
.clear_screen
	sta ppu_data
	inx
	bne .clear_screen
	iny
	cpy #$04
	bne .clear_screen
	
	; titlet display
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

	rts

