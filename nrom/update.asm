
update: subroutine

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

	jsr nsf_play 

	lda #%00011000
	sta ppu_mask

	rti
