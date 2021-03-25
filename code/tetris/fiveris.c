#include <stdio.h>
#include <unistd.h>  // for sleep
#include <stdlib.h>
#include <pthread.h> //POSIX standard threading library.
#include <ncurses.h>

#define ROW pivot[0]
#define COL pivot[1]
#define ROWS 30
#define COLS 14
#define lock()   pthread_mutex_lock(&mtx)
#define unlock() pthread_mutex_unlock(&mtx)


// GLOBAL STATIC DATA
pthread_mutex_t mtx;
int score;
int pivot[2] = {3,5};

int pieces[] = {
	0 ,-2,0 ,-1,0 ,0 ,0 ,1 ,0 ,2 ,
	0 ,-2,0 ,-1,0 ,0 ,0 ,1 ,1 ,1 ,
	0 ,-1,1 ,-1,0 ,0 ,0 ,1 ,0 ,2 ,
	0 ,-1,0 ,0 ,1 ,0 ,0 ,1 ,0 ,2 ,
	0 ,-2,0 ,-1,0 ,0 ,0 ,1 ,1 ,0 ,
	1 ,-1,0 ,-1,0 ,0 ,0 ,1 ,-1,1 ,
	-1,-1,0 ,-1,0 ,0 ,0 ,1 ,1 ,1 ,
	0 ,-1,0 ,0 ,0 ,1 ,1 ,1 ,1 ,-1,
	0 ,-2,0 ,-1,0 ,0 ,1 ,0 ,2 ,0 ,
	-1,1 ,0 ,1 ,0 ,0 ,1 ,0 ,1 ,-1,
	0 ,-1,0 ,0 ,0 ,1 ,1 ,0 ,2 ,0 ,
	0 ,-1,0 ,0 ,0 ,1 ,1 ,-1,1 ,0 ,
	0 ,-1,0 ,0 ,0 ,-2,1 ,-1,1 ,0 ,
	0 ,0 ,0 ,-1,0 ,1 ,1 ,0 ,-1,0 ,
	-1,-1,-1,0 ,0 ,0 ,0 ,1 ,0 ,2 ,
	0 ,-2,0 ,-1,0 ,0 ,-1,0 ,-1,1 ,
	0 ,-1,0 ,0 ,0 ,1 ,-1,0 ,1 ,1 ,
	0 ,-1,0 ,0 ,0 ,1 ,-1,0 ,1 ,-1};



int *piece = &pieces; // L piece

void generate_piece(){
	pivot[0] = 3;
	pivot[1] = 5;
	piece = &pieces[10*(rand()%18)];
}

int board[ROWS*COLS];

WINDOW * game_win;
WINDOW * score_win;

int game_over = false;

void initialize_board(){
	for (int i = 0; i < ROWS*COLS; i++){
		board[i] = 0;
	}
}

void dots(){
	for (int i = 0; i<ROWS-1; i++){
		for (int j = 0; j<COLS; j++){
			mvwaddch(game_win, i+1, j+1, '.');
		}
	}
}

void b_set(int row, int col, int val){
	board[row*COLS + col] = val;
}

int b_get(int row, int col){
	return board[row*COLS + col];
}
void clear_lines(){
restart:
	for (int i = ROWS-1; i >= 0; i--){
		for (int j = 0; j < COLS; j++){
			if (b_get(i , j) == 0){ // if anything in row was zero, break loop
				goto skip;
			}
		}
		// otherwise they were all one, in which case we delete the row
		// and move everything else down. 
		score++;
		for (int m = i; m > 0; m--){
			for (int n = 0; n < COLS; n++){
				b_set(m, n, b_get(m-1, n));
				if (b_get(m, n) == 0) {
					mvwaddch(game_win, m,n+1,'.');
				} else {
					mvwaddch(game_win, m,n+1, ACS_CKBOARD);
				}
			}
		}
		goto restart;
skip:
		(void) 0;
	}
	mvwprintw(score_win,1,1,"%d", score);
	wrefresh(score_win);
	wrefresh(game_win);
}

bool placeable(int row_target, int col_target) {
	for (int i = 0; i < 5; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		if (ROW+row_offset+row_target >= ROWS) // floor
			return false;
		if (COL+col_offset+col_target < 0 || COL+col_offset+col_target >= COLS) // walls
			return false;
		if (b_get(ROW+row_offset+row_target, COL+col_offset+col_target) == 1) // other piece
			return false;
	}
	return true;
}

void rotate() {	
	for (int i = 0; i < 5; i++){
		int temp = piece[2*i];
		piece[2*i] = piece[2*i+1];
		piece[2*i+1] = -temp;
	}
	if (placeable(0,0)){
		return;
	} else { // rotate back
		for (int i = 0; i < 5; i++){
			int temp = piece[2*i];
			piece[2*i] = -piece[2*i+1];
			piece[2*i+1] = temp;
		}
	}

}


void clear_piece() {
	for (int i = 0; i < 5; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		mvwaddch(game_win, ROW + row_offset, 1+ COL + col_offset,'.');
	}
}

void draw_piece() {
	for (int i = 0; i < 5; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		mvwaddch(game_win, ROW + row_offset, 1 + COL + col_offset, ACS_CKBOARD);
	}
}

void plant_piece() {
	for (int i = 0; i < 5; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		b_set(ROW + row_offset, COL + col_offset, 1);
	}
}

// thread body functions need to have this signature. 
void* key_handler(void* arg){
	// called shared value pointer here just for demonstration
	// in case we end up sending an object into the thread
	int* shared_var_ptr = (int*)arg;
	
	for (;;) {	
		if (game_over){
			unlock();
			return NULL;
		}
		int ch = getch();
		lock();
		if (game_over){
			unlock();
			return NULL;
		}
		/* CRITICAL SECTION */
		clear_piece();
		switch(ch){	
			case KEY_UP:
				rotate();
				break;
			case KEY_DOWN:
				if (placeable(1,0)){
					ROW++;
				}
				break;
			case KEY_RIGHT:
				if (placeable(0,1))
					++COL;
				break;
			case KEY_LEFT:
				if (placeable(0,-1))
					--COL;
				break;
			case 'q':
				game_over = true;
				break;
			case ' ':
				while (placeable(1,0)){
					++ROW;
				}
				break;
		}
		draw_piece();
		wrefresh(game_win);
		/********************/
		unlock();
	}
	return NULL;
}	

void* dropper(void* arg){
	int* shared_var_ptr = (int*)arg;
	
	for (;;) {
		usleep(500000);
		lock();
		/* CRITICAL SECTION */
		if (placeable(1,0)){
			clear_piece();
			ROW++;
		} else {
			plant_piece();
			clear_lines();
			generate_piece();
			if (!placeable(0,0)){
				game_over = true;
				unlock();
				return NULL;
			}
		}	
		draw_piece();
		wrefresh(game_win);
		/********************/
		unlock();
		if (game_over)
			return NULL;
	}
	return NULL;
}

// when we reach pthread_mutex_lock, the function will wait until
// another thread unlocks the mutex before it can go into its 
// critical section. by default, this thread will go into sleeping
// mode if it finds the mutex locked, it does not go into busy-wait
// if you want it to busy-wait, make a pthread_spin_t object instead
// and use it in the same way. 


WINDOW *create_newwin(int height, int width, int starty, int startx)
{	WINDOW *local_win;

	local_win = newwin(height, width, starty, startx);
	box(local_win, 0 , 0);
	wrefresh(local_win);		/* Show that box 		*/

	return local_win;
}

int main(){
	int ch;
	score = 0;
	initialize_board();
	initscr();               // start ncurses	
	raw();                   // Line buffering disabled	
	noecho();                // Don't echo() while we do getch
	keypad(stdscr, TRUE);    // allow input from arrow keys
	curs_set(0);             // hide the cursor
	refresh();

	game_win = create_newwin(ROWS + 1, COLS + 2, 3, 3);
	score_win = create_newwin(3,6, 3, COLS + 5);
	dots();
	wrefresh(score_win);
	wrefresh(game_win);

	//thread handlers
	pthread_t thread1;
	pthread_t thread2;

	pthread_mutex_init(&mtx, NULL);

	//create new threads
	//second parameter is about data space allocation for the thread, 
	//if left NULL, the thread is given the default data space. 
	int result1 = pthread_create(&thread1, NULL, key_handler, &pivot);
	int result2 = pthread_create(&thread2, NULL, dropper, &pivot);

	if (result1 || result2){
		printf("The threads could not be created.\n");
		exit(1);
	}

	//wait for threads to finish
	result1 = pthread_join(thread1, NULL);
	result2 = pthread_join(thread2, NULL);

	if (result1 || result2){
		printf("The threads could not be joined.\n");
		exit(2);
	}

	pthread_mutex_destroy(&mtx);
	
	printw("threads joined successfully");
	wrefresh(game_win);
	sleep(1);
	endwin(); // End curses mode		 
	return 0;
}
