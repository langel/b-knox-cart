
update: subroutine

	inc wtf
	bne .not_next
	inc song_id
	lda song_id
	and #$03
	sta song_id
	jsr init_track
.not_next

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
