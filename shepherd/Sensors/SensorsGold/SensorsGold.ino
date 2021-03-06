int pins[] = {2, 3, 4, 5, 6, 10};
char goals[] = {'A', 'B', 'C', 'D', 'E', 'G'};
int states[] = {LOW, LOW, LOW, LOW, LOW, LOW};
int count = 0;
/*
Pins for setting up the field.
Pin 2: A
Pin 3: B
Pin 4: C
Pin 5: D
Pin 6: E
Pin 10: G
*/

void setup() {
  Serial.begin(115200);
  for (int pin: pins) {
    pinMode(pin, INPUT);
  }
}

void loop() {
  for (int i = 0; i < 6; i++) {
    int pinState = digitalRead(pins[i]);
    if (pinState == LOW && states[i] == HIGH) {
      Serial.print("lbg;");
      Serial.print("gold");
      Serial.println(goals[i]);
      states[i] = LOW;
    } else if (pinState == HIGH) {
      states[i] = HIGH;
    }
  }
  count = (count + 1) % 20;
  if (count == 0) {
    Serial.println("lbg;hb");
  }
  delay(50);
}
