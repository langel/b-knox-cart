
booter: subroutine

	; set modes
	sei
	cld

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
	sta $700,x	
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

	; wait for ppu to warm up
.vsync_wait_1
	bit ppu_status
	bpl .vsync_wait_1
.vsync_wait_2
	bit ppu_status
	bpl .vsync_wait_2

	cli

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
	jsr nsf_init

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

	lda #%10000000
	sta ppu_ctrl
	lda #%00011000
	sta ppu_mask
	lda #$00
	sta ppu_scroll
	sta ppu_scroll


.spinner
	jmp .spinner
