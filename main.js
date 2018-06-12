//QUIZ
const readline = require('readline');

// Importo las funciones a medida que las necesito.
const {log, biglog, errorlog, colorize} = require('./out');

const cmds = require('./cmds');

const net = require("net");

net.createServer(socket => {

	console.log("Se ha conectado un cliente desde " + socket.remoteAddress);

	// Mensaje inicial
	biglog(socket, 'CORE Quiz', 'green');

	const rl = readline.createInterface({
		input: socket,
		output: socket,
		prompt: colorize("quiz > ", 'blue'),
		completer: (line) => {
			const completions = 'h help add delete list test p play credits q quit'.split(' ');
			const hits = completions.filter((c) => c.startsWith(line));
			// show all completions if none found
			return [hits.length ? hits : completions, line];
		}
	});

	socket
	.on("end" , () => {rl.close(); })

	.on("error" , () => {rl.close(); });

	rl.prompt();

	rl
	.on('line', (line) => {
		// Cojo la línea y la parto por un especio en blanco.
		let args = line.split(" ");
		// Cojo el comando y lo pongo en minúsculas
		let cmd = args[0].toLowerCase().trim();

		switch (cmd) {
			case '':
				rl.prompt(socket, rl);
				break;

			case 'h':
			case 'help':
				cmds.helpCmd(socket, rl);
				break;

			case 'quit':
			case 'q':
				cmds.quitCmd(socket, rl);
				break

			case 'add':
				cmds.addCmd(socket, rl);
				break;

			case 'list':
				cmds.listCmd(socket, rl);
				break;

			case 'show':
				cmds.showCmd(socket, rl, args[1]);
				break;

			case 'test':
				cmds.testCmd(socket, rl, args[1]);
				break;

			case 'play':
			case 'p':
				cmds.playCmd(socket, rl);
				break;

			case 'delete':
				cmds.deleteCmd(socket, rl, args[1]);
				break;

			case 'edit':
				cmds.editCmd(socket, rl, args[1]);
				break;

			case 'credits':
				cmds.creditsCmd(socket, rl);
				break;

			default:
				log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
				log(socket, `Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
				rl.prompt();
				break;
		}
		/** rl.prompt(); */
	})
	.on('close', () => {
		log(socket, 'Adios!');
		// process.exit(0);		¡No debo matar el servidor!
	});

})

.listen(3030);

