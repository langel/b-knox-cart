
update: subroutine

	inc wtf
	bne .not_next
	inc wtf_hi
	lda wtf_hi
	cmp #$40
	bne .not_next
	lda #$00
	sta wtf_hi
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
