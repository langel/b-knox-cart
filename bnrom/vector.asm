
	processor 6502

	include "./define.asm"

	org $fd00
addr_booter
	include "./booter.asm"

	org $fe20
	include "./titlet.asm"

	org $fe40
	include "./tables.asm"

	org $fea0
addr_update
	include "./update.asm"

	; vectors
	org $fffa
	.word addr_update ; nmi
	.word addr_booter ; reset
	.word addr_update ; brk
