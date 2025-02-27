
booter: subroutine

	; set modes
	sei
	cld

	; wait for ppu to warm up
.vsync_wait_1
	bit ppu_status
	bpl .vsync_wait_1
.vsync_wait_2
	bit ppu_status
	bpl .vsync_wait_2

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

	; init cart
	lda #$00
	sta song_id
	sta $8000



init_track: subroutine

	sei
	; wait for vblank
.vsync_wait
	bit ppu_status
	bpl .vsync_wait

	; disable rendering
	lda #$00
	sta ppu_mask

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

	; setup pointers
	ldx song_id
	stx $8000
	lda track_inits_lo,x
	sta init_ptr_lo
	lda track_inits_hi,x
	sta init_ptr_hi
	lda track_updates_lo,x
	sta play_ptr_lo
	lda track_updates_hi,x
	sta play_ptr_hi
	lda track_lengths_lo,x
	sta length_lo
	lda track_lengths_hi,x
	sta length_hi
	
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

	jsr .nsf_init

.spinner
	jmp .spinner

.nsf_init
	jmp (init_ptr_lo)

