
addr_booter eqm $fd00
addr_titlet eqm $fe00
addr_update eqm $ff00

ppu_ctrl    eqm $2000
ppu_mask    eqm $2001
ppu_status  eqm $2002
oam_addr    eqm $2003
oam_data    eqm $2004
ppu_scroll  eqm $2005
ppu_addr    eqm $2006
ppu_data    eqm $2007

apu_pulse1  eqm $4000
apu_pulse2  eqm $4004
apu_triang  eqm $4008
apu_noise   eqm $400c
apu_dpcm    eqm $4010
apu_status  eqm $4015
apu_frame   eqm $4017

ppu_oam_dma eqm $4014

joypad1		eqm $4016
joypad2		eqm $4017


song_id     eqm $80

nmi_ptr_lo  eqm $82
nmi_ptr_hi  eqm $83
init_ptr_lo eqm $84
init_ptr_hi eqm $85
play_ptr_lo eqm $86
play_ptr_hi eqm $87

minutes_tens eqm $90
minutes_ones eqm $91
seconds_tens eqm $92
seconds_ones eqm $93
frames_tens  eqm $94
frames_ones  eqm $95

wtf         eqm $c0
wtf_hi      eqm $c1
