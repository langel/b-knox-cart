

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


song_id     eqm $180

nmi_ptr_lo  eqm $182
nmi_ptr_hi  eqm $183
init_ptr_lo eqm $184
init_ptr_hi eqm $185
play_ptr_lo eqm $186
play_ptr_hi eqm $187

minutes_tens eqm $190
minutes_ones eqm $191
seconds_tens eqm $192
seconds_ones eqm $193
frames_tens  eqm $194
frames_ones  eqm $195

wtf         eqm $1a0
wtf_hi      eqm $1a1

controls    eqm $1a8
controls_d  eqm $1a9

temp00      eqm $1aa
temp01      eqm $1ab
