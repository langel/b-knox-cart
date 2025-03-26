

	processor 6502

	include "./define.asm"


	org address

bank_update: subroutine

	lda #$20
	sta ppu_addr
	lda #$77
	sta ppu_addr
	lda wtf
	sta ppu_data 

	jsr rand0
	lsr
	lsr
	and #$03
	clc
	adc #$20
	;lda #$21
	sta ppu_addr
	jsr rand0
	sta ppu_addr
	jsr rand0
	sta ppu_data
	sta ppu_data
	sta ppu_data
	sta ppu_data

	lda #$22
	sta ppu_addr
	lda wtf
	sta ppu_addr
	lda rng0
	sta ppu_data

	inc temp06
	lda temp06
	;sta ppu_scroll
	lda wtf
	and #$01
	bne .skip_y
	inc temp07
.skip_y
	lda temp07
	;sta ppu_scroll
	lda #$00
	sta ppu_scroll
	sta ppu_scroll

	lda #%10001000
	sta ppu_ctrl
	lda #%00011110
	sta ppu_mask

	jsr rand0
	lsr
	and #$03
	clc
	adc #$24
	sta temp02
	jsr rand0
	sta temp03
	jsr rand0
	sta temp04

	rts
	

	include "./common.asm"
