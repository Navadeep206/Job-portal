
import dns from 'dns';

const hostname = 'cluster0.xtime6s.mongodb.net';

console.log(`Resolving DNS for ${hostname}...`);
dns.resolveSrv('_mongodb._tcp.' + hostname, (err, addresses) => {
    if (err) {
        console.error('DNS Resolution Failed:', err);
    } else {
        console.log('SRV Records found:', addresses);
    }
});
