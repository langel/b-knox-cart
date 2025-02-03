
	processor 6502

	include "./define.asm"

	org addr_booter
	include "./booter.asm"

	org addr_titlet
	include "./titlet.asm"

	include "./tables.asm"

	org addr_update
	include "./update.asm"

	; vectors
	org $fffa
	.word addr_update ; nmi
	.word addr_booter ; reset
	.word addr_update ; brk
