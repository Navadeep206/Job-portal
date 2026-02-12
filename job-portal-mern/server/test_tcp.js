
import net from 'net';

const client = new net.Socket();
console.log('Connecting to google.com:80...');
client.connect(80, 'google.com', () => {
    console.log('Connected to google.com:80 successfully!');
    client.destroy();
});

client.on('error', (err) => {
    console.error('Connection Failed:', err);
});
