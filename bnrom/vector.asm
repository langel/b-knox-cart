
	processor 6502

	include "./define.asm"

	org $fd00
	include "./booter.asm"

	org $fe80
	include "./titlet.asm"

	org $fea0
	include "./tables.asm"

	org $ff00
	include "./update.asm"

	; vectors
	org $fffa
	.word addr_update ; nmi
	.word addr_booter ; reset
	.word addr_update ; brk
