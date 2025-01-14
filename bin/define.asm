
addr_booter eqm $fd00
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

