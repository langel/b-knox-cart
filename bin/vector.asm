
	processor 6502

	include "./define.asm"

	org $fd00
	include "./booter.asm"

	org $ff00
	include "./update.asm"

	; vectors
	org $fffa
	hex ff00 ; nmi
	hex fd00 ; reset
	hex ff00 ; brk
