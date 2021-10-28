
X2 = [];
Y2 = [];

Ps2 = [2161,  462;%
       1915,  512;
       1500,  982;
       1650, 1210;
       1950, 1344;
       2163, 1268;
       2171, 1013;
       2431,  888;
       2600,  541];

Ps2 = [Ps2; Ps2(1,:)]

[r,q] = size(Ps2);

for i=2:r
    [xx, yy] = trazado(Ps2(i-1,1), Ps2(i-1,2), Ps2(i,1), Ps2(i,2));
    X2 = [X2 xx];
    Y2 = [Y2 yy];
end

plot(X2,Y2,'-k')
%plot(Ps2(:,1),Ps2(:,2),'.-r')