

init_track: subroutine

	sei
	; wait for vblank
.vsync_wait
	bit ppu_status
	bpl .vsync_wait

	; disable rendering
	lda #$00
	sta ppu_mask

	; zero out system
	ldx #$ff
	txs
	inx
	stx ppu_mask
	stx apu_status
	stx ppu_ctrl
	bit ppu_status
	bit apu_status
	lda #$40
	sta apu_frame
	lda #$0f
	sta apu_status

	; clear ram
	lda #0	
	tax		
.clear_ram_loop
	sta $000,x	
	sta $100,x	
	sta $200,x	
	sta $300,x	
	sta $400,x	
	sta $500,x	
	sta $600,x	
	inx		
	bne .clear_ram_loop	

	; setup pointers
	ldx song_id
	stx $8000
	lda bank_inits_lo,x
	sta init_bank_lo
	lda bank_inits_hi,x
	sta init_bank_hi
	lda bank_updates_lo,x
	sta play_bank_lo
	lda bank_updates_hi,x
	sta play_bank_hi
	lda track_inits_lo,x
	sta init_nsf_lo
	lda track_inits_hi,x
	sta init_nsf_hi
	lda track_updates_lo,x
	sta play_nsf_lo
	lda track_updates_hi,x
	sta play_nsf_hi
	lda track_lengths_lo,x
	sta length_lo
	lda track_lengths_hi,x
	sta length_hi

	jsr bank_init
	
	; init nsf
	lda #$00
	ldx #$13
.clear_apu_regs
	sta $4000,x
	dex
	bpl .clear_apu_regs
	lda #$00
	sta apu_status
	lda $0f
	sta apu_status
	lda $40
	sta apu_frame
	lda #$00
	ldx #$00

	sta ppu_scroll
	sta ppu_scroll
	
	cli

	jsr nsf_init


.spinner
	jmp .spinner



bank_init:
	jmp (init_bank_lo)

nsf_init:
	jmp (init_nsf_lo)

