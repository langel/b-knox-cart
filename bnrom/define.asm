
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

init_bank_lo  eqm $80
init_bank_hi  eqm $81
play_bank_lo  eqm $82
play_bank_hi  eqm $83
init_nsf_lo   eqm $84
init_nsf_hi   eqm $85
play_nsf_lo   eqm $86
play_nsf_hi   eqm $87

wtf           eqm $9a
wtf_hi        eqm $9b

minutes_tens  eqm $90
minutes_ones  eqm $91
seconds_tens  eqm $92
seconds_ones  eqm $93
frames_tens   eqm $94
frames_ones   eqm $95

length_lo     eqm $96
length_hi     eqm $97

temp00        eqm $98
temp01        eqm $99
temp02        eqm $9a
temp03        eqm $9b
temp04        eqm $9c
temp05        eqm $9d
temp06        eqm $9e
temp07        eqm $9f

controls      eqm $7f8
controls_d    eqm $7f9

song_id       eqm $7ff


nsf_init_addr eqm $fd50
titlet_table  eqm $fe00
