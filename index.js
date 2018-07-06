const Discord = require('discord.js');
var request = require('request');
const client = new Discord.Client();
var http = require('http'),
    fs = require('fs');

client.on('ready', () => {
    console.log('Ready!');
});

var app = http.createServer();
var io = require('socket.io').listen(app);

app.listen(3001);
var kullanici = 0;
io.sockets.on('connection', function(socket) {
    kullanici++;
    fs.readFile(__dirname + '/klanuyeleri.txt','utf8', function(err, data) {
      socket.emit('klanuyeleri', { klanuyelerirt: data });
    });
    setInterval(function (){
      fs.readFile(__dirname + '/klanuyeleri.txt','utf8', function(err, data) {
        socket.emit('klanuyeleri', { klanuyelerirt: data});
      });
    }, 2000);
    console.log(kullanici+' kullanıcı bağlı, gönderim yapılıyor...');
    socket.on('disconnect', function() {
      kullanici--;
      console.log(kullanici+' kullanıcı bağlı, gönderim yapılıyor...');
   });
});

client.on('guildMemberUpdate', rol => {
    var klanrolu = rol.guild.roles.find("name", "TUV Klan Üyesi");
    var klanuyeleri = klanrolu.members;
    fs.writeFile(__dirname + '/klanuyeleri.txt', klanuyeleri.array(), function (err) {
      if (err) throw err;
      console.log('Yeni klan uyeleri dosyaya kaydedildi!');
    });
});

client.on('message', message => {
  if (message.content === 'tuv-bot nedir' || message.content === 'tuv-bot ne la' || message.content === 'tuv-bot ne' || message.content === 'tuv bot ne la' || message.content === 'tuv bot ne' || message.content === 'tuv bot ne?') {
      // send back "Pong." to the channel the message was sent in
      message.channel.send('Kurucu Thorakna\'nın kodladığı orijinal discord botudur. Bu bot ile !rolver [OyunNickiniz] komutunu kullanarak rol alabilirsiniz. !tuv [OyunNickiniz] komutunu kullanarak bazı oyun istatistiklerinizi öğrenebilirsiniz!');
      console.log('Bir soruya cevap verildi!! [tuv-bot-nedir]');
  }else if (message.content === 'sa' || message.content === 'slm' || message.content === 'selam' || message.content === 'selamun aleyküm' || message.content === 'selamın aleyküm') {
      message.channel.send('As Reyis !fduo komutuyla duoya, !fsquad komutuyla squada arkadaş arayabilirsin!');
      console.log('Bir soruya cevap verildi!! [sa]');
  }else if (message.content.split(" ")[0] === '!rolver') {
      var playerNamer = message.content.substr(8);
      var optionsr = {
        method: "GET",
        url: `https://fortnite.y3n.co/v2/player/${playerNamer}`,
        headers: {
          'User-Agent': 'nodejs request',
          'X-Key': "Whz7sJMQNbHeP7GYOxZZ"
        }
      }

      request(optionsr, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          var stats = JSON.parse(body);
          var allstats = stats.br.stats.pc.all;
          if(allstats.wins >= 1 && allstats.wins < 10){
            message.member.addRole(message.guild.roles.find("name", "Acemi Üye (+1 Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Acemi rolü verildi!');
            message.channel.send(`Acemi üye rolü verildi!`);
          }else if(allstats.wins >= 10 && allstats.wins < 25){
            message.member.addRole(message.guild.roles.find("name", "Çırak Üye (10+ Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Çırak Üye rolü verildi!');
            message.channel.send('Çırak üye rolü verildi!');
          }else if(allstats.wins >= 25 && allstats.wins < 50){
            message.member.addRole(message.guild.roles.find("name", "Kalfa Üye (25+ Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Kalfa Üye rolü verildi!');
            message.channel.send('Kalfa üye rolü verildi!');
          }else if(allstats.wins >= 50 && allstats.wins < 100){
            message.member.addRole(message.guild.roles.find("name", "Tecrübeli Üye (50+ Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Tecrübeli Üye rolü verildi!');
            message.channel.send('Tecrübeli üye rolü verildi!');
          }else if(allstats.wins >= 100 && allstats.wins < 200){
            message.member.addRole(message.guild.roles.find("name", "Uzman Üye (100+ Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Uzman Üye rolü verildi!');
            message.channel.send('Uzman üye rolü verildi!');
          }else if(allstats.wins >= 200 && allstats.wins < 500){
            message.member.addRole(message.guild.roles.find("name", "Profesyonel Üye (200+ Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Profesyonel Üye rolü verildi!');
            message.channel.send('Profesyonel üye rolü verildi!');
          }else if(allstats.wins >= 500 && allstats.wins < 1000){
            message.member.addRole(message.guild.roles.find("name", "Taktik Dehası (500+ Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Taktik Dehası rolü verildi!');
            message.channel.send('Taktik dehası rolü verildi!');
          }else if(allstats.wins >= 1000){
            message.member.addRole(message.guild.roles.find("name", "Efsanevi Üye (1000+ Win)")).catch(console.error);
            console.log(playerName+' adlı oyuncuya Efsanevi Üye rolü verildi!');
            message.channel.send('Efsanevi üye rolü verildi!');
          }
        }else {
          console.log('HATA: '+body+' | '+playerName);
        }
      })
  }else if (message.content.split(" ")[0] === '!tuv') {
      var playerName = message.content.substr(5);// player in game name

      var options = {
        method: "GET",
        url: `https://fortnite.y3n.co/v2/player/${playerName}`,
        headers: {
          'User-Agent': 'nodejs request',
          'X-Key': "Whz7sJMQNbHeP7GYOxZZ"
        }
      }

      request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          var stats = JSON.parse(body);
          var allstatst = stats.br.stats.pc.all;
          console.log(`${playerName} Win: ${stats.br.stats.pc.all.wins}`);
          message.channel.send(`${playerName} toplamda ${allstatst.matchesPlayed} maç oynayıp ${allstatst.kills} kişi öldürmüş.Bu maçların ${allstatst.wins} tanesini kazanmış.\n \nKazanma Oranı: %${allstatst.winRate} \nK/D: ${allstatst.kpd}`);
        }else {
          console.log('HATA: '+body+' | '+playerName);
        }
      })
  }
});

client.login('NDYzODgxMDk1MTU1Mjg2MDU2.Dh2-Bw.pfXj2njmqmH51ryluU-XA5C3-Rk');
