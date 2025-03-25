
	processor 6502

	include "./define.asm"

	org $fd00
addr_booter
	include "./booter.asm"

	org nsf_init_addr
	include "./init_t.asm"

	org titlet_table
	incbin "./titlet_table"	

	org $fe60
	include "./tables.asm"

	org $ff00
addr_update
	include "./update.asm"

	; vectors
	org $fffa
	.word addr_update ; nmi
	.word addr_booter ; reset
	.word addr_update ; brk
