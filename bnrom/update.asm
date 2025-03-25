
; NMI

update: subroutine

	jsr update_bank

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

	jsr controller_read

	rti


update_bank: subroutine
	jmp (play_bank_lo)



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
