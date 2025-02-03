
	processor 6502

	org $7ff0

	hex 4e 45 53 1a ; header
	hex 02 ; 16k prg banks
	hex 01 ; 8k chr banks
	hex 01 ; vertical mirror
	hex 00 ; mapper
	hex 00 00 00 00 00 00 00 00
