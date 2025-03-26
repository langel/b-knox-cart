

	processor 6502

	include "./define.asm"


	org address

bank_init: subroutine

	lda #$3f
	sta rng0
	sta rng1

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

	lda #$24
	sta ppu_addr
	lda #$00
	sta ppu_addr
	tax
.noise_machine
	jsr rand0
	sta ppu_data
	jsr rand0
	sta ppu_data
	jsr rand1
	sta ppu_data
	jsr rand0
	sta ppu_data
	inx
	bne .noise_machine

	lda #%10001000
	sta ppu_ctrl
	lda #%00011000
	sta ppu_mask
	
	rts
	
	include "./common.asm"
