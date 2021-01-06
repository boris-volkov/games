



function findLineByLeastSquares(values_x, values_y) {
    let x_sum = 0;
    let y_sum = 0;
    let xy_sum = 0;
    let xx_sum = 0;
    let count = 0;

    let x = 0;
    let y = 0;
    let values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    if (values_length === 0) {
        return [ [], [] ];
    }

    for (let i = 0; i< values_length; i++) {
        x = values_x[i];
        y = values_y[i];
        x_sum+= x;
        y_sum+= y;
        xx_sum += x*x;
        xy_sum += x*y;
        count++;
    }

    let m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    let b = (y_sum/count) - (m*x_sum)/count;

    let result_values_x = [];
    let result_values_y = [];

    for (let i = 0; i < values_length; i++) {
        x = values_x[i];
        y = x * m + b;
        result_values_x.push(x);
        result_values_y.push(y);
    }

    return [m, b, result_values_x, result_values_y];
}
