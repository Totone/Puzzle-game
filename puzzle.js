(function(){
	var cellSize; 				// size of a square cell
	var storage = {}; 			// store a moving piece
	var piecesPosition = []; 	// Control: Pieces position in the grid
	var piecesOrientation = []; // Control: Pieces orientation in the grid
	var isMovingPiece = false;
	var status = 'move'; 		// Mode: move, rotate

	/* GRID & CELLS */

	function createPuzzleGrid(location, colsNb, rowsNb)
	{
		var parentElem = document.getElementById(location);
		var tableText, column, row, cellNumber;

		var newTable = document.createElement('table');
		newTable.setAttribute('id', 'puzzleGrid')

		cellSize = Math.round((getComputedStyle(parentElem).width).substring(0, getComputedStyle(parentElem).width.indexOf('p')) * 0.9 / colsNb);

		// création du HTML
		tableText = '<thead><tr><th> </th></tr></thead>';
		for (row = 0, cellNumber = 0; row < rowsNb; row++)
		{
			tableText += '<tr>\n';
			for (column = 0; column < colsNb; column++) 
			{
				tableText += '<td style="width:' + cellSize + 'px; height:' + cellSize + 'px;">';
				tableText += '<div class="cell" id="c' + cellNumber + '"> </td>';
				cellNumber++;
			}
			tableText += '</tr>\n';
		}
		newTable.innerHTML = tableText;
		parentElem.appendChild(newTable);

		setCellsEvents();
	}

	function setCellsEvents()
	{
		var cells = document.querySelectorAll('.cell');

		for (var i = 0, c = cells.length; i < c; i++) 
		{
			cells[i].addEventListener('click', function(e)
			{
				if (isMovingPiece && storage.id != undefined)
				{
					e.target.style.visibility = 'hidden';
					piecesPosition[storage.id] = e.target.id.substring(1);
					storage = {};
					isMovingPiece = false;
				}
			});
		}
	}

	/* PIECES */

	function createPieces(location, colsNb, rowsNb, pieceSize)
	{
		var parentElem = document.getElementById(location),
			piecesNb = colsNb * rowsNb,
			maxwidth = parseInt(getComputedStyle(parentElem).width) - (pieceSize),
			maxheight = parseInt(getComputedStyle(parentElem).height) - (pieceSize),
			piecesList = [];

		for(var i = 0; i < piecesNb; i++)
		{
			(function()
			{
				var newPiece = document.createElement('div');

				newPiece.className = 'piece';
				newPiece.style.height = pieceSize + 'px';
				newPiece.style.width = pieceSize + 'px';
				newPiece.id = 'p' + i;
			
				var posX = (i % colsNb) * pieceSize, 
					posY = (i / colsNb) * pieceSize;

				newPiece.setAttribute('background-position', posX + 'px ' + posY + 'px');
				newPiece.style.top = Math.floor(Math.random() * (maxheight)) + 'px';
				newPiece.style.left = Math.floor(Math.random() * (maxwidth)) + 'px';
				piecesList[i] = newPiece;
				parentElem.appendChild(newPiece);
				piecesPosition[i] = -1;
			})();
		}
		setPiecesBackground(piecesList, 8, 6, 125);
		setPiecesEvents();
	}

	function setPiecesBackground(list, colsNb,rowsNb, pieceSize)
	{
		var i = 0, posX, posY, randNb;

		for (var y = 0; y < rowsNb; y++)
		{
			posY = -y * pieceSize;
			for (var x = 0; x < colsNb; x++)
			{
				posX = -x * pieceSize;
				list[i].style.backgroundPosition = posX + 'px ' + posY + 'px';
				

				setPieceOrientation(list[i], i, true);

				i++;
			}	
		}
	}

	function setPieceOrientation(piece, index, isRandom, dir='hor')
	{
		//var newOrientation = isRandom ? Math.floor(Math.random() * 4) : (piecesOrientation[index] == 3 ? 0 : ++piecesOrientation[index]);

		if(isRandom)
			newOrientation = Math.floor(Math.random() * 4);
		else
		{
			if(dir == 'hor')
				newOrientation = (piecesOrientation[index] == 3 ? 0 : ++piecesOrientation[index]);
			else
				newOrientation = (piecesOrientation[index] == 0 ? 3 : --piecesOrientation[index]);
		}

		piece.style.transform = 'rotate(' + (newOrientation * 90) + 'deg)';
		piecesOrientation[index] = newOrientation;
	}

	function setPiecesEvents()
	{
		var pieces = document.querySelectorAll('.piece'),
		piecesLength = pieces.length;

		for (var i = 0; i < piecesLength; i++) 
		{
		    pieces[i].addEventListener('click', function(e) 
		    {
		      	var s = storage;
		        s.target = e.target;
		        s.offsetX = e.clientX - s.target.offsetLeft;
		        s.offsetY = e.clientY - s.target.offsetTop;
		        s.id = e.target.id.substring(1);

		        if (status == 'move')
		        {
		        	if(isMovingPiece == false)
			    	{
			    		isMovingPiece = true;
				        if (piecesPosition[s.id] != -1)
				        {
				        	var cell = document.querySelector('#c' + piecesPosition[s.id]);
				        	cell.style.visibility = 'visible';
				        	piecesPosition[s.id] = -1;
				        }
			    	}
			    	else
			    	{
			    		isMovingPiece = false;
			    		storage = {};
			    	}
		        }
		        else if (status == 'rotate')
		        {
		        	s.target = setPieceOrientation(s.target, s.id, false, 'anti');
		        	storage = {};
		        }	        
			});

			pieces[i].addEventListener('contextmenu', function(e) {
				e.preventDefault();
				
				var s = storage;
		        s.target = e.target;
		        s.offsetX = e.clientX - s.target.offsetLeft;
		        s.offsetY = e.clientY - s.target.offsetTop;
		        s.id = e.target.id.substring(1);
				s.target = setPieceOrientation(s.target, s.id, false, 'hor');
			});
		}

		document.addEventListener('mousemove', function(e) { 
		    var target = storage.target;

		    if (target) 
		    {
		        target.style.top = e.clientY - storage.offsetY + 'px';
		        target.style.left = e.clientX - storage.offsetX + 'px';
		    }
		});
	}

	/* BUTTONS */

	function createButtons()
	{
		var parentElem = document.getElementById('puzzleControls'), 
			buttons = ['Check', 'Restart', 'Status'];

		for (var i = 0, c = buttons.length; i < c ; i++)
		{
			(function(){
				var newButton = document.createElement('input');
				newButton.type = "button";
				newButton.id= 'b' + buttons[i];
				newButton.value = buttons[i] == 'Status' ? 'Move' : buttons[i];

				switch(buttons[i])
				{
					case 'Check':
						newButton.addEventListener('click', eventCheck);
						document.getElementById('gameButtons').appendChild(newButton);
						break;			
					case 'Restart':
						newButton.addEventListener('click', eventRestart);
						document.getElementById('gameButtons').appendChild(newButton);
						break;
					case 'Status':
						newButton.addEventListener('click', eventStatus);
						document.getElementById('statusButtons').appendChild(newButton);
						var p = document.createElement('p');
						p.id = 'pStatus';
						p.innerHTML = 'Clic gauche: déplacer une pièce<br>Clic droit: rotation dans le sens horaire';
						document.getElementById('statusButtons').appendChild(newButton);
						document.getElementById('statusButtons').appendChild(p);
						break;	
				}
			})();
		}

		var p = document.createElement('p');
		p.style.color = 'green';
		p.style.fontWeight = 'bold';
		p.style.fontSize = '1.2em';
		p.style.textAlign = 'center';

		p.id = 'bOutput';

		p.innerHTML = 'Amusez-vous bien!';
		parentElem.appendChild(p);
	}

	var eventRestart = function()
	{
		if(window.confirm('Êtes-vous sûr de vouloir recommencer depuis le début?'))
			location.reload();
	};

	var eventStatus = function()
	{
		if (status == 'move')
		{
			status = 'rotate'; 
			document.querySelector('#bStatus').value = 'Rotate';
			document.querySelector('#pStatus').innerHTML = 'Clic gauche: rotation dans le sens anti-horaire<br>Clic droit: rotation dans le sens horaire';
		}
		else
		{
			status = 'move';
			document.querySelector('#bStatus').value = 'Move';
			document.querySelector('#pStatus').innerHTML = 'Clic gauche: déplacer une pièce<br>Clic droit: rotation dans le sens horaire';
		}
	};

	var eventCheck = function ()
	{
		var isDone = true,
			notComplete = false,
			output = document.querySelector('#bOutput');

		piecesPosition.forEach(function(value, index){
			if (value == -1)
				notComplete = true;
			else if (value != index)
				isDone = false;
		});

		piecesOrientation.forEach(function(value, index){
			if (value != 0)
				isDone = false;
		});

		output.innerHTML = isDone ? 'Vous avez réussi!' : (notComplete ? "Vous n'avez pas placé<br>toutes les pièces!" : "Ce n'est pas encore bon...");
	};

	createPuzzleGrid('puzzleField', 8, 6);
	createPieces('puzzleBag', 8, 6, parseInt(cellSize));
	createButtons();
})();