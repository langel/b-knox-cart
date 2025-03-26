
rand0: subroutine
	lda rng0
	lsr
	bcc .no_ex_or
	eor #$d4
.no_ex_or:
	sta rng0
	rts

rand1: subroutine
	lda rng1
	asl
	bcc .no_ex_or
	eor #$a9
.no_ex_or:
	sta rng1
	rts

