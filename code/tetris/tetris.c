#include <stdio.h>
#include <unistd.h>  // for sleep
#include <stdlib.h>
#include <pthread.h> //POSIX standard threading library.
#include <ncurses.h>

#define ROW pivot[0]
#define COL pivot[1]
#define ROWS 20
#define COLS 20
#define lock()   pthread_mutex_lock(&mtx)
#define unlock() pthread_mutex_unlock(&mtx)

pthread_mutex_t mtx;

int pivot[2] = {0,0};
int piece[2*4] = {0,0,0,1,0,2,1,2}; // L piece

int board[ROWS*COLS];

void initialize_board(){
	for (int i = 0; i < ROWS*COLS; i++){
		board[i] = 0;
	}
}

void b_set(int row, int col, int val){
	board[row*COLS + col] = val;
}

int b_get(int row, int col){
	return board[row*COLS + col];
}

void generate_piece(){
	pivot[0] = 0;
	pivot[1] = 0;
}

void clear_piece() {
	for (int i = 0; i < 4; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		mvaddch(ROW + row_offset, COL + col_offset, ' ');
	}
}

void draw_piece() {
	for (int i = 0; i < 4; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		mvaddch(ROW + row_offset, COL + col_offset, ACS_CKBOARD);
	}
}

void plant_piece() {
	for (int i = 0; i < 4; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		b_set(ROW + row_offset, COL + col_offset, 1);
	}
}

bool droppable(){
	for (int i = 0; i < 4; i++){
		int row_offset = piece[2*i];
		int col_offset = piece[2*i+1];
		if (ROW+row_offset+1 >= ROWS) { // on floor
			mvprintw(0,0,"floor          ");
			refresh();
			return false;
		}
		if  (b_get(ROW+row_offset+1, COL+col_offset) == 1 ) { // on another
			mvprintw(0,0,"on piece          ");
			refresh();
			return false;
		}
	}
	return true;
}

// thread body functions need to have this signature. 
void* key_handler(void* arg){
	// called shared value pointer here just for demonstration
	// in case we end up sending an object into the thread
	int* shared_var_ptr = (int*)arg;
	
	for (int i = 0; i < 100; i++) {
		int ch = getch();
		lock();
		/* CRITICAL SECTION */
		clear_piece();
		switch(ch){	
			case KEY_UP:
				ROW--;
				break;
			case KEY_DOWN:
				if (droppable()){
					ROW++;
				}
				break;
			case KEY_RIGHT:
				if (++COL >= COLS)
					--COL;
				break;
			case KEY_LEFT:
				if (--COL <= 0)
					++COL;
				break;
		}
		draw_piece();
		refresh();
		/********************/
		unlock();
	}
	return NULL;
}

	

void* dropper(void* arg){
	int* shared_var_ptr = (int*)arg;
	
	for (int i = 0; i < 50; i++) {
		usleep(200000);
		lock();
		/* CRITICAL SECTION */
		if (droppable()){
			clear_piece();
			ROW++;
		} else {
			plant_piece();
			generate_piece();
		}	
		draw_piece();
		refresh();
		/********************/
		unlock();
	}
	return NULL;
}

// when we reach pthread_mutex_lock, the function will wait until
// another thread unlocks the mutex before it can go into its 
// critical section. by default, this thread will go into sleeping
// mode if it finds the mutex locked, it does not go into busy-wait
// if you want it to busy-wait, make a pthread_spin_t object instead
// and use it in the same way. 

int main(){
	int ch;

	initialize_board();
	initscr();               // start ncurses	
	raw();                   // Line buffering disabled	
	noecho();                // Don't echo() while we do getch
	keypad(stdscr, TRUE);    // allow input from arrow keys
	curs_set(0);             // hide the cursor

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
	refresh();
	sleep(1);
	endwin(); // End curses mode		 
	return 0;
}
