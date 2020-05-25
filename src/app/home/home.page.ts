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
  step = 0;
  rulesForm: FormGroup;
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  Rules = [[]] as [string[]];
  cRules = [""] as string[];
  Vars = [""] as string[];

  extraRules = [""] as string[];
  extraVars = [""] as string[];

  Buttons = [true, true, true, true, true, true] as boolean[];
  inputs = false;
  breset = true;
  bcontinue = true;
  bstart = false;

  constructor(private alertCtrl: AlertController) { }

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
      Var1: new FormControl(null, [Validators.required, Validators.pattern('[A-Z]'), Validators.maxLength(1)]),
      Var2: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)]),
      Var3: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)]),
      Var4: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)]),
      Var5: new FormControl(null, [Validators.pattern('[A-Z]'), Validators.maxLength(1)])
    });
  }

  patchForm() {
    this.rulesForm.patchValue({
      Rule1: this.cRules[1],
      Rule2: this.cRules[2],
      Rule3: this.cRules[3],
      Rule4: this.cRules[4],
      Rule5: this.cRules[5],
      Var1: this.Vars[1],
      Var2: this.Vars[2],
      Var3: this.Vars[3],
      Var4: this.Vars[4],
      Var5: this.Vars[5]
    })
  }

  eraseForm() {
    this.rulesForm.patchValue({
      Rule1: "",
      Rule2: "",
      Rule3: "",
      Rule4: "",
      Rule5: "",
      Var1: "",
      Var2: "",
      Var3: "",
      Var4: "",
      Var5: ""
    })
  }

  onSubmit() {
    if (this.rulesForm.valid) {
      const rule1 = this.rulesForm.controls.Rule1.value as string;
      const rule2 = this.rulesForm.controls.Rule2.value as string;
      const rule3 = this.rulesForm.controls.Rule3.value as string;
      const rule4 = this.rulesForm.controls.Rule4.value as string;
      const rule5 = this.rulesForm.controls.Rule5.value as string;
      const v1 = this.rulesForm.controls.Var1.value as string;
      const v2 = this.rulesForm.controls.Var2.value as string;
      const v3 = this.rulesForm.controls.Var3.value as string;
      const v4 = this.rulesForm.controls.Var4.value as string;
      const v5 = this.rulesForm.controls.Var5.value as string;

      this.breset = false;
      this.bstart = true;
      this.Buttons[0] = false;
      this.inputs = true;
      this.step = 1;

      const rules = [null, rule1, rule2, rule3, rule4, rule5];
      this.Vars = ["", v1, v2, v3, v4, v5]
      this.Rules.pop();
      this.extraRules.pop();
      this.extraVars.pop();
      for (let i = 0; i < rules.length; i++) {
        if (rules[i] != null) {
          this.Rules.push(rules[i].split('|'));
          this.cRules[i] = this.Rules[i].join('|');
        } else {
          this.Rules.push(null);
        }
        if (this.Vars[i] != null && this.Vars[i] != "") {
          if (this.alphabet.includes(this.Vars[i])) {
            var ri = this.alphabet.indexOf(this.Vars[i]);
            this.alphabet.splice(ri, 1);
          } else {
            this.presentAlert('¡Informacion incorrecta!', 'Hay variables repetidas. Usa variables unicas');
            this.reset(false);
          }
        }
      }
    } else {
      this.presentAlert('¡Informacion incompleta!', 'Por favor rellenar los campos correctamente');
    }
  }

  apply(rulenum: number) {
    switch (this.step) {
      case 1:
        this.Vars[0] = "S0";
        this.Rules[0] = [this.Vars[1]];
        this.cRules[0] = this.Vars[1];
        this.Buttons[0] = true;
        this.bcontinue = false;
        break;
      case 2:
        var vari = this.Vars[rulenum];
        var rule = this.Rules[rulenum];
        const lambda = rule.indexOf("µ");
        rule.splice(lambda, 1)
        for (let i = 0; i < this.Rules.length; i++) {
          this.cRules[i] = ""
          if (this.Rules[i] != null) {
            for (let j = 0; j < this.Rules[i].length; j++) {
              if (this.Rules[i][j].includes(vari)) {
                if (this.Rules[i][j] === vari) {
                  if (i == rulenum) {
                    console.log("Regla uniciclica");
                  } else {
                    this.Rules[i].push("µ");
                  }
                } else {
                  const temp = this.Rules[i][j].split("");
                  var tVIAll = new Array<number>();
                  for (let k = 0; k < temp.length; k++) {
                    if (temp[k] == vari) {
                      tVIAll.push(k);
                    }
                  }
                  const count = tVIAll.length;
                  for (let k = 0; k < (2 ** count) - 1; k++) {
                    var bcount = k.toString(2);
                    bcount = '0'.repeat(count - bcount.length) + bcount
                    var ntemp = this.Rules[i][j].split("");
                    let shift = 0
                    for (let l = 0; l < bcount.length; l++) {
                      if (bcount[l] == '0') {
                        ntemp.splice(tVIAll[l] - shift, 1);
                        shift++;
                      }
                    }
                    var stemp = ntemp.join("");
                    if (!this.Rules[i].includes(stemp)) {
                      this.Rules[i].push(stemp);
                    }
                  }
                }
              }
            }
            this.cRules[i] = this.Rules[i].join("|");
          }
        }
        this.patchForm();
        this.check();
        break;
      case 3:
        var vari = this.Vars[rulenum];
        var rule = this.Rules[rulenum];
        this.cRules[rulenum] = ""
        var pass = true;
        for (let i = 0; i < rule.length; i++) {
          if (rule[i].length == 1 && rule[i] === rule[i].toUpperCase() && rule[i] !== rule[i].toLowerCase() && pass) {
            if (rule[i] !== vari) {
              for (let k = 0; k < this.Rules.length; k++) {
                if (this.Rules[k] !== null) {
                  if (this.Vars[k] == rule[i]) {
                    this.Rules[k].forEach(x => {
                      if (!rule.includes(x)) {
                        rule = rule.concat(x)
                      }
                    });
                    pass = false;
                  }
                }
              }
            }
            rule.splice(i, 1)
          }
        }
        this.Rules[rulenum] = rule
        this.cRules[rulenum] = this.Rules[rulenum].join("|");
        this.patchForm();
        this.check();
        break;
      case 4:
        var vari = this.Vars[rulenum];
        var rule = this.Rules[rulenum];
        for (let i = 0; i < rule.length; i++) {
          if (rule[i].length != 1) {
            var sArr = [...rule[i]]
            for (let j = 0; j < sArr.length; j++) {
              if (sArr[j] == sArr[j].toLowerCase()) {
                sArr[j] = this.newRule(rule[i][j]);
              }
            }
            rule[i] = sArr.join("");
          }
        }
        this.Rules[rulenum] = rule
        this.cRules[rulenum] = this.Rules[rulenum].join("|");
        this.patchForm();
        this.check();
        break;
      case 5:
        var vari = this.Vars[rulenum];
        var rule = this.Rules[rulenum];
        for (let i = 0; i < rule.length; i++) {
          if (rule[i].length > 2) {
              var newChars = rule[i].slice(-2)
              const tempVar = this.newRule(newChars)
              var sArr = [...rule[i]]
              sArr.splice(-2, 2)
              rule[i] = sArr.join("");
              rule[i] = rule[i].concat(tempVar)
          }
        }
        this.Rules[rulenum] = rule
        this.cRules[rulenum] = this.Rules[rulenum].join("|");
        this.patchForm();
        this.check();
        break;
    }
  }

  checkVarExists(extraChars: string): string {
    for (let i = 0; i < this.Rules.length; i++) {
      if (this.Rules[i] != null) {
        if (this.Rules[i].length == 1 && this.Rules[i][0] == extraChars) {
          return this.Vars[i];
        }
      }
    }
    for (let i = 0; i < this.extraRules.length; i++) {
      if (this.extraRules[i] == extraChars) {
        return this.extraVars[i];
      }
    }
    return null
  }

  newRule(extraChars: string): string {
    const check = this.checkVarExists(extraChars)
    if (check == null) {
      const newVar = this.alphabet.shift();
      this.extraVars.push(newVar);
      this.extraRules.push(extraChars);
      return newVar
    } else {
      return check
    }
  }

  continue() {
    this.step += 1
    this.check()
  }

  reset(hard: boolean) {
    if (hard) {
      this.eraseForm();
    }
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.Rules = [[]];
    this.cRules = [""];
    this.Vars = [""];
    this.extraRules = [];
    this.extraVars = [""];
    this.Buttons = [true, true, true, true, true, true];
    this.inputs = false;
    this.breset = true;
    this.bcontinue = true;
    this.bstart = false;
    this.step = 0;
  }

  check() {
    switch (this.step) {
      case 2:
        this.bcontinue = false;
        for (let i = 1; i < this.Rules.length; i++) {
          this.Buttons[i] = true;
          if (this.Rules[i] != null && this.Rules[i].includes('µ')) {
            this.Buttons[i] = false;
            this.bcontinue = true;
          }
        }
        break;
      case 3:
        this.bcontinue = false;
        for (let i = 0; i < this.Rules.length; i++) {
          this.Buttons[i] = true;
          if (this.Rules[i] != null) {
            for (let j = 0; j < this.Rules[i].length; j++) {
              if (this.Rules[i][j].length == 1 && this.Rules[i][j] === this.Rules[i][j].toUpperCase() && this.Rules[i][j] !== this.Rules[i][j].toLowerCase()) {
                this.Buttons[i] = false;
                this.bcontinue = true;
              }
            }
          }
        }
        break;
      case 4:
        this.bcontinue = false;
        for (let i = 0; i < this.Rules.length; i++) {
          this.Buttons[i] = true;
          if (this.Rules[i] != null) {
            for (let j = 0; j < this.Rules[i].length; j++) {
              if (this.Rules[i][j].length >= 2) {
                const chArr = [...this.Rules[i][j]]
                for (let k = 0; k < chArr.length; k++) {
                  if (chArr[k].toLowerCase() == chArr[k]) {
                    this.Buttons[i] = false;
                    this.bcontinue = true;
                  }
                }
              }
            }
          }
        }
        break;
      case 5:
        for (let i = 0; i < this.Rules.length; i++) {
          this.Buttons[i] = true;
          if (this.Rules[i] != null) {
            for (let j = 0; j < this.Rules[i].length; j++) {
              if (this.Rules[i][j].length > 2) {
                this.Buttons[i] = false;
                this.bcontinue = true;
              }
            }
          }
        }
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


