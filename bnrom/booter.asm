
booter: subroutine

	; set modes
	sei
	cld
	
	; disable rendering
	lda #$00
	sta ppu_ctrl
	sta ppu_mask

	; wait for ppu to warm up
.vsync_wait_1
	bit ppu_status
	bpl .vsync_wait_1
.vsync_wait_2
	bit ppu_status
	bpl .vsync_wait_2

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
