
#include <stdio.h>
#include <stdlib.h>

int trees(int);

int main(int argc, char *argv[]) {
	int n = atoi(argv[1]);
	trees(n);
	return 0;
}

int trees(int n) {

	FILE *fp;
	fp = fopen("trees.txt", "w+");

	// one extra slot for sentinel,
	// one for end of string char
	char a[2*n + 1 + 1]; 

	a[0] = ')'; 		// sentinel
	a[2*n + 1] = '\0';  // end of string	

	for (int i = 1; i < 2*n; i += 2){
		a[i] = '(';
		a[i+1] = ')';
	}
		
	int m, j, k;
	m = 2*n-1;

visit:

	fputs(a+1, fp);
	fputs("\n", fp);

	a[m] = ')';
	if (a[m-1] == ')'){
		a[m-1] = '(';
		m = m-1;
		goto visit;
	}

	j = m - 1;
	k = 2*n - 1;
	while (a[j] == '('){
		a[j] = ')';
		a[k] = '(';
		j = j - 1;
		k = k - 2;
	}

	if (j == 0){
		fclose(fp);
		return 0;
	}

	a[j] = '(';
	m = 2*n - 1;
	goto visit;

	return -1;
}
