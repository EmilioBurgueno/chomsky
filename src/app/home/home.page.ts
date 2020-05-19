import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  regla: any;
  step: number;
  rulesForm: FormGroup;
  Rules: [string[]]
  R0; R1; R2; R3; R4; R5;
  v0; v1; v2; v3; v4; v5;
  b0 = true; b1 = true; b2 = true; b3 = true; b4 = true; b5 = true;
  inputs = false;
  reset = true;
  continue = true;
  start = false;

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.rulesForm = new FormGroup({
      Rule1: new FormControl(null, [Validators.required]),
      Rule2: new FormControl(null),
      Rule3: new FormControl(null),
      Rule4: new FormControl(null),
      Rule5: new FormControl(null),
      Var1: new FormControl(null, [Validators.required]),
      Var2: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)]),
      Var3: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)]),
      Var4: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)]),
      Var5: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)])
    });
  }

  onSubmit() {
    if (this.rulesForm.valid) {
      const rule1 = this.rulesForm.controls.Rule1.value as string;
      const rule2 = this.rulesForm.controls.Rule2.value as string;
      const rule3 = this.rulesForm.controls.Rule3.value as string;
      const rule4 = this.rulesForm.controls.Rule4.value as string;
      const rule5 = this.rulesForm.controls.Rule5.value as string;
      this.v1 = this.rulesForm.controls.Var1.value as string;
      this.v2 = this.rulesForm.controls.Var2.value as string;
      this.v3 = this.rulesForm.controls.Var3.value as string;
      this.v4 = this.rulesForm.controls.Var4.value as string;
      this.v5 = this.rulesForm.controls.Var5.value as string;

      const rules = [rule1, rule2, rule3, rule4, rule5];
      for (let index = 1; index < rules.length+1; index++) {
        if (rules[index] != null) {
          this.Rules[index] = rules[index].split('|');
        }
      }

      this.step = 1;
      this.reset = false;
      this.continue = false;
      this.start = true;

    } else {
      this.presentAlert('¡Informacion incompleta!', 'Por favor rellenar los campos correctamente');
    }
  }

  apply(rulenum: number) {
    switch(this.step) {
      case 1:
        this.v0 = "S0"
        this.Rules[0] = ["S"]
        this.R0 = "S"
        break;
      case 2:
        const rule = this.Rules[rulenum];
        const lambda = rule.indexOf("µ")
        rule.splice(lambda, 1)
        for (let i = 0; i < this.Rules.length; i++) {
          if (i != rulenum) {
            for (let j = 0; j < this.Rules[i].length; j++) {
              //if (this.Rules[i][j].includes()){}
            }
          }
        }
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
    }
  }

  async presentAlert(title: string, body: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: body,
      buttons: ['Listo']
    });

    await alert.present();
  }

}


