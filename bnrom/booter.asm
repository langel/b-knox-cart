
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
	
	; clear 700
	lda #0	
	tax		
.clear_ram_loop
	sta $700,x	
	inx		
	bne .clear_ram_loop	

	; init cart
	lda #$00
	sta song_id
	sta $8000

	; bank init
	jmp init_track
