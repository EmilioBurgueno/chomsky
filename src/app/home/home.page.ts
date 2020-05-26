import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  //Mensaje a imprimir
  msg = ["Usa los botones laterales para activar o desactivar la regla indicada. Presiona start para comenzar."]
  //Contador de Steps
  step = 0;
  //Iniciar Forms
  rulesForm: FormGroup;
  //Alfabeto 
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  //Inicializar arreglos de variables y reglas
  Rules = [[]] as [string[]];
  cRules = [""] as string[];
  Vars = [""] as string[];

  //Inicializar arreglos de variables y reglas extras
  extraRules = [""] as string[];
  extraVars = [""] as string[];
  printExtraRules = [[""], [""], []] as [string[], string[], number[]];

  controls = [] as AbstractControl[];
  required = [false, false, false, false] as boolean[];

  //Seguimiento de botones para habilitarlos o deshabilitarlos
  Buttons = [true, true, false, false, false, false] as boolean[];
  inputs = [false, true, true, true, true] as boolean[];
  breset = true;
  bcontinue = true;
  bstart = false;

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
    this.initForm();
    this.getControls();
  }

  //Forms de los inputs de Reglas y Variablew
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

  //Update de la forma
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

  //Pseudoupdate para actualizar los validadores
  pseudoPatchForm() {
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
    this.rulesForm.patchValue({
      Rule1: rule1,
      Rule2: rule2,
      Rule3: rule3,
      Rule4: rule4,
      Rule5: rule5,
      Var1: v1,
      Var2: v2,
      Var3: v3,
      Var4: v4,
      Var5: v5
    })
  }

  //Funcion para borrar todos los campos de la forma
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

  //Guardar los controles de la forma para poder manejar la validación
  getControls() {
    this.controls.push(this.rulesForm.get('Rule2'));
    this.controls.push(this.rulesForm.get('Rule3'));
    this.controls.push(this.rulesForm.get('Rule4'));
    this.controls.push(this.rulesForm.get('Rule5'));
    this.controls.push(this.rulesForm.get('Var2'));
    this.controls.push(this.rulesForm.get('Var3'));
    this.controls.push(this.rulesForm.get('Var4'));
    this.controls.push(this.rulesForm.get('Var5'));
  }

  //Aplicar la validacion a los campos y revisar si es correcto o no 
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
      this.Buttons = [false, true, true, true, true, true];
      this.inputs = [true, true, true, true, true];
      this.step = 1;

      this.msg = "Usa los botones laterales para interactuar con las reglas./nHaz click en el boton de descripción para saber que se esta haciendo en este paso./nUsa los botones inferiores para continuar o empezar desde 0".split("/n");
      const rules = [null, rule1, rule2, rule3, rule4, rule5];
      this.Vars = ["", v1, v2, v3, v4, v5]
      this.Rules.pop();
      this.extraRules.pop();
      this.extraVars.pop();
      this.printExtraRules[0].pop();
      this.printExtraRules[1].pop();
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


  //Aplica las operaciones necesarias para cada paso , separadas en cases para cada paso
  apply(rulenum: number) {
    switch (this.step) {
      case 0:
        this.required[rulenum - 2] = !this.required[rulenum - 2];
        if (this.required[rulenum - 2]) {
          this.controls[rulenum + 2].setValidators([Validators.required, Validators.pattern('[A-Z]'), Validators.maxLength(1)]);
          this.controls[rulenum - 2].setValidators([Validators.required]);
          this.inputs[rulenum - 1] = false;
          this.msg[0] = "La regla " + rulenum + " se ha activado"
        } else {
          this.controls[rulenum + 2].setValidators([Validators.pattern('[A-Z]'), Validators.maxLength(1)]);
          this.controls[rulenum - 2].setValidators(null);
          this.controls[rulenum + 2].setValue("");
          this.controls[rulenum - 2].setValue("");
          this.inputs[rulenum - 1] = true;
          this.msg[0] = "La regla " + rulenum + " se ha desactivado"
        }
        this.controls[rulenum + 2].updateValueAndValidity;
        this.controls[rulenum - 2].updateValueAndValidity;
        this.pseudoPatchForm();
        break;
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
                  if (stemp == "") {
                    if (this.Vars[i] != vari) {
                      if (!this.Rules[i].includes("µ")) {
                        this.Rules[i].push("µ");
                      }
                    }
                  } else {
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
        this.Rules[rulenum] = Array.from(new Set(this.Rules[rulenum]));
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
        this.Rules[rulenum] = Array.from(new Set(this.Rules[rulenum]));
        this.cRules[rulenum] = this.Rules[rulenum].join("|");
        this.patchForm();
        this.check();
        break;
    }
  }

  //Funcion para saber que letra del Alfabeta aun esta disponible 
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

  //Crea las nuevas reglas extra que se pueden llegar a necesitar en los pasos 4 y 5 
  newRule(extraChars: string): string {
    const check = this.checkVarExists(extraChars)
    if (check == null) {
      const newVar = this.alphabet.shift();
      this.extraVars.push(newVar);
      this.extraRules.push(extraChars);
      this.printExtraRules[0].push(newVar);
      this.printExtraRules[1].push(extraChars);
      this.printExtraRules[2].push(this.printExtraRules[0].length - 1)
      console.log(this.printExtraRules)
      return newVar
    } else {
      return check
    }
  }

  //Cambia el step actual y luego realiza un check para saber en que reglas se puede alpicar el current step
  continue() {
    this.step += 1
    this.check()
  }

  //Reset de todos los campos y variables
  reset(hard: boolean) {
    this.msg[0] = "Usa los botones laterales para activar o desactivar la regla indicada. Presiona start para comenzar.";
    this.msg[1] = "";
    this.msg[2] = "";
    this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.Rules = [[]];
    this.cRules = [""];
    this.Vars = [""];
    this.extraRules = [];
    this.extraVars = [""];
    this.printExtraRules = [[""], [""], []];
    this.Buttons = [true, true, false, false, false, false];
    this.inputs = [false, true, true, true, true];
    this.breset = true;
    this.bcontinue = true;
    this.bstart = false;
    this.step = 0;
    for (let i = 0; i < this.controls.length / 2; i++) {
      this.controls[i].setValidators([Validators.pattern('[A-Z]'), Validators.maxLength(1)]);
      this.controls[i + 4].setValidators(null);
      this.controls[i].updateValueAndValidity;
      this.controls[i + 4].updateValueAndValidity;
    }
    if (hard) {
      this.eraseForm();
    }
  }

  //Revisa en que reglas se pueden aplicar los pasos 
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
        var finish = true;
        this.bcontinue = true;
        for (let i = 0; i < this.Rules.length; i++) {
          this.Buttons[i] = true;
          if (this.Rules[i] != null) {
            for (let j = 0; j < this.Rules[i].length; j++) {
              if (this.Rules[i][j].length > 2) {
                this.Buttons[i] = false;
                finish = false;
              }
            }
          }
        }
        if (finish) {
          this.presentAlert('Fin del proceso', 'Su gramatica esta en su Forma Normal de Chomsky');
        }
        break;
    }
  }

  //Alerts que muestran las descripciones de los pasos a seguir 
  alertSwitch(step: number) {
    var title = ""
    var body = ""
    switch (step) {
      case 1:
        title = 'Paso 1'
        body = 'Agregamos una nueva variable inical S0 y la regla S0 produce S'
        this.presentAlert(title, body);
        break;
      case 2:
        title = 'Paso 2'
        body = 'Removemos las reglas que producen cadena vacia del tipo A -> µ donde A no es la variable inicial. Despues para cada occurencia de la variable A del lado derecho de una regla, agregamos una nueva regla con la ocurrencia borrada.'
        this.presentAlert(title, body);
        break;
      case 3:
        title = 'Paso 3'
        body = 'Removemos las reglas unitarias'
        this.presentAlert(title, body);
        break;
      case 4:
        title = 'Paso 4'
        body = 'Convertimos las reglas restantes. Reemplazamos cada regla que contenga combinacion de Variables con terminales'
        this.presentAlert(title, body);
        break;
      case 5:
        title = 'Paso 5'
        body = 'Finalmente cambiamos todas las reglas que contengan mas de 2 Variables creando nuevas variables'
        this.presentAlert(title, body);
        break;
    }
  }

  //Funcion que crea las alertas
  async presentAlert(title: string, body: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: body,
      buttons: ['Listo']
    });

    await alert.present();
  }

}


