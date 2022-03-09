import { Component, OnChanges, Input, Output, EventEmitter, SimpleChange } from '@angular/core';


@Component({
    moduleId: module.id,
    selector: 'password-strength-bar-cmp',
    templateUrl: 'password-strength-bar.component.html'
})

export class PasswordStrengthBarComponent implements OnChanges {
    @Input() passwordToCheck: string;
    @Output() strength = new EventEmitter<number>();
    percentage: string;
    public value: number;

    private colors = ['#F00', '#F90', '#FF0', '#9F0', '#0F0'];
    private progressbar_percentage_value = [20, 40, 60, 80, 100];
    private progressbar_class_values = ['bg-danger', 'bg-warning', 'bg-info', '', 'bg-success'];

    private static measureStrength(pass: string) {
        let score = 0;

        // award every unique letter until 5 repetitions  
        let letters = {};
        for (let i = 0; i < pass.length; i++) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        // bonus points for mixing it up  
        let variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        };

        let variationCount = 0;

        for (let check in variations) {
            variationCount += (variations[check]) ? 1 : 0;
        }

        score += (variationCount - 1) * 10;

        return Math.trunc(score);
    }

    private getColor(score: number) {

        let idx = 0;

        if (score > 90) {
            idx = 4;
        } else if (score > 70) {
            idx = 3;
        } else if (score >= 40) {
            idx = 2;
        } else if (score >= 20) {
            idx = 1;
        }

        this.percentage = '30';

        return {
            idx: idx + 1,
            col: this.colors[idx]
        };
    }

    ngOnInit() {
        var password = "";
        this.setBarColors(5, '#DDD');

        if (password) {
            const strength = PasswordStrengthBarComponent.measureStrength(password);
            this.strength.emit(strength);
            let c = this.getColor(strength);
            this.setBarColors(c.idx, c.col);
        }
    }

    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {

        var password = changes['passwordToCheck'].currentValue;
        this.setBarColors(5, '#DDD');
        let body = document.getElementsByClassName('progress-bar')[0];

        if (password) {

            const strength = PasswordStrengthBarComponent.measureStrength(password);
            this.strength.emit(strength);
            let c = this.getColor(strength);

            this.setBarColors(c.idx, c.col);
            this.value = this.progressbar_percentage_value[(c.idx - 1)];

            for (let _n = 0; _n < 5; _n++) {
                if (body.classList.contains(this.progressbar_class_values[_n])) {
                    if (this.progressbar_class_values[_n] != this.progressbar_class_values[(c.idx - 1)]) {
                        body.classList.remove(this.progressbar_class_values[_n]);
                    }
                }
                body.classList.add(this.progressbar_class_values[(c.idx - 1)]);
            }
        }
        else {
            for (let _n = 0; _n < 5; _n++) {
                if (body.classList.contains(this.progressbar_class_values[_n])) {
                    body.classList.remove(this.progressbar_class_values[_n]);
                }
            }
            this.value = 0;
        }
    }

    private setBarColors(count, col) {
        for (let _n = 0; _n < count; _n++) {
            this['bar' + _n] = col;
        }
    }
}
