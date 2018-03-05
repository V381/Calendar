const Calendar = {
    date: new Date(),
    _main: document.querySelector("main"),
    _state: {},
    _datePickerState: {},
    _createEl(element, html) {
        let el = document.createElement(element);
        el.innerHTML = html || "";
        return el;
    },
    _appendEl(el, elToAppend, val) {el.appendChild(elToAppend).innerHTML = val || ""},
    _h1: null,
    _button: null,
    _span: null,
    _yearWrapper: null,
    _table: null,
    _elMonth: null,
    _tableWrapper: null,
    _monthCounter: 1,
    _preventWrongDate: false,
    _preventWrongMonth: false,
    _localStorageCounter: 0,
    _selectedDates : [],
    // We increment by 1 all dates so it matches correct number of month names
    _monthNames: {
        "January": 1,
        "February": 2,
        "March": 3,
        "April": 4,
        "May": 5,
        "Jun": 6,
        "July": 7,
        "August": 8,
        "September": 9,
        "October": 10,
        "November": 11,
        "December": 12
    },

    init(year, month) {
        year = year || this.date.getFullYear();
        month = month || this.date.getMonth() + 1;
        this._h1 = this._createEl("h1"),
        this._button = this._createEl("button"),
        this._span = this._createEl("span"),
        this._yearWrapper = this._createEl("section"),
        this._table = this._createEl("table"),
        this._elMonth = this._createEl("section"),
        this._tableWrapper = this._createEl("section"),
        this._createState(year, month);
        this._renderYear();
        this._renderMonth();
        this._renderTable();
        this._renderData();
        this._handleEvents();
    },

    _createState(year, month) {
        if (month > 12) {
            return false;
        }
        this._state.currentMonth = month;
        this._state.currentYear = year
        this._state.currentDay = this.date.getDate();
        
        return this._state;
    },
    _renderYear() {
        const elYear = this._yearWrapper;
        this._appendEl(this._main, this._yearWrapper);
        this._appendEl(this._yearWrapper, this._createEl("h1"));
        this._yearWrapper.children[0].appendChild(this._span)
        .appendChild(this._createEl("button", "prev"))
        this._yearWrapper.children[0].appendChild(this._createEl("span"))
        .appendChild(this._createEl("p", `Year: ${this._state.currentYear}`))
        this._yearWrapper.children[0].appendChild(this._createEl("span"))
        .appendChild(this._createEl("button", "next"))
    },
    _renderMonth() {
        const elMon = this._elMonth;
        this._appendEl(this._main, elMon);
        this._appendEl(elMon, this._createEl("h1"));
        elMon.children[0].appendChild(this._createEl("span")
        .appendChild(this._createEl("button", "prev")));
        elMon.children[0].appendChild(this._createEl("span", `Month: ${this._state.currentMonth}`))
        elMon.children[0].appendChild(this._createEl("span"))
        .appendChild(this._createEl("button", "next"))
    },
    _renderTable() {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thusday", "Friday", "Saturday"];
        for(let i = 0; i <= 6; i++){
            this._table.appendChild(this._createEl("tr"))
        }
        for(let i = 0; i < days.length; i++){
            this._table.children[0].appendChild(this._createEl("th", days[i]))
        }

        this._appendEl(this._main, this._tableWrapper);
        this._tableWrapper.appendChild(this._table);
        const tableRows = this._table.querySelectorAll("tr")
    },
    _firstDayOfTheMonth() {
        return new Date(this._state.currentYear, this._state.currentMonth - 1, 1, 12).getDay();
    },
    
    _lastDayOfTheMonth() {
        const lastDay = new Date(this._state.currentYear, this._state.currentMonth, 0);
        return lastDay.getDate();
    },
    _daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    },
    _setCorrectMonthNames(state) {
        for (let i in this._monthNames) {
            if (this._monthNames[i] ===this._state.currentMonth) {
                this._elMonth.querySelector("span").innerHTML = i;
                this._elMonth.querySelector("h1 > span").innerHTML = i;
            }
        }
    },

    _createEventList() {
        const formSection = this._createEl("section");
        const formHeadLine = this._createEl("h2");
        const form = this._createEl("form");
        const input = this._createEl("input");
        const button = this._createEl("button");

        formHeadLine.innerHTML = "To Do List for";
        button.innerHTML = "Add";
        input.setAttribute("type", "text");
        form.appendChild(input);
        form.appendChild(button);
        formSection.appendChild(formHeadLine);
        formSection.appendChild(form);
        return formSection;
    },

    _handleEvents() {
        const prevYear = this._yearWrapper.children[0].children[0].children[0];
        const nextYear = this._yearWrapper.children[0].children[2].children[0];
        const prevMonth = this._elMonth.children[0].children[0];
        const nextMonth = this._elMonth.children[0].children[2].children[0];
        const daysNames = this._table.querySelectorAll("tr > td");        

        prevMonth.addEventListener("click", () => {
            if (this._state.currentMonth === 1) {
                this._state.currentYear -= 1;
                this._state.currentMonth = 12;
                this._yearWrapper.children[0].children[1].innerHTML = `Year: ${this._state.currentYear}`;
                return this._renderData();
            }
            this._state.currentMonth -= 1
            this._renderData();
        });
        nextMonth.addEventListener("click", () => {
            if (this._state.currentMonth === 12) {
                this._state.currentYear += 1;
                this._state.currentMonth = 1;
                this._yearWrapper.children[0].children[1].innerHTML = `Year: ${this._state.currentYear}`;
                return this._renderData();
            }
            this._state.currentMonth += 1;
            this._renderData();
        });

        prevYear.addEventListener("click", () => {
            this._state.currentYear -= 1;
            this._yearWrapper.children[0].children[1].innerHTML = `Year: ${this._state.currentYear}`;
            this._renderData();
        })
        nextYear.addEventListener("click", () => {
            this._state.currentYear += 1;
            this._yearWrapper.children[0].children[1].innerHTML = `Year: ${this._state.currentYear}`;
            this._renderData();
        });

        this._table.addEventListener("click", (e) => {
            if (e.target.nodeName === "TH") {
                return false;
            }

            if (e.target.className === "prevMonthDates") {
                prevMonth.click();
                let selectedDay = e.target.innerHTML;
                for (let i = 0; i < daysNames.length; i++) {
                    if (daysNames[i].innerHTML === selectedDay) {
                       selectedDay = "wtf";
                    }
                    break;
                }
            }
     
        });

    },
    clearTable(table) {
        for(let i = 1; i < table.length; i++){
            table[i].innerHTML = " "
        }
    },

    _nextMonth() {
        const now = new Date();
        return current = new Date(now.getFullYear(), now.getMonth()+1, 1);
    },

    _prevMonth() {
        const now = new Date();
        now.setDate(1);
        return new Date(now.setMonth(now.getMonth()-1)).getMonth() + 1;
    },

    _renderData() {
        const tableRows = this._table.querySelectorAll("tr")
        this.clearTable(tableRows)
        for(let i = 1; i <= tableRows.length; i++){
            for(let j = 0; j <= 6; j++){
                if (tableRows[i] === undefined) {
                    break;
                } else {
                    let tds = this._createEl("td");
                    tds.removeAttribute("class")
                    tableRows[i].appendChild(tds);
                }
            }
        }

        const daysNames = this._table.querySelectorAll("tr > td");
        const firstDay = daysNames[this._firstDayOfTheMonth()].innerHTML = 1;
        const lastDay = daysNames[this._firstDayOfTheMonth() + this._lastDayOfTheMonth() - 1].innerHTML = this._lastDayOfTheMonth()
        const nodes = Array.prototype.slice.call(daysNames);
        const startOfTheMonth = nodes.indexOf(daysNames[this._firstDayOfTheMonth()])
        const endOfTheMonth = nodes.indexOf(daysNames[this._firstDayOfTheMonth() + this._lastDayOfTheMonth() - 1]);

        let monthCounter = 0;        
        let daysCounter = 1;
        let daysInPrevMonth = this._daysInMonth(this._state.currentMonth - 1, this._state.currentYear);

        // Set correct month date if the day passes into next month
        for (let i = startOfTheMonth - 1; i >= 0; i--) {
            daysNames[i].innerHTML = daysInPrevMonth--;
            daysNames[i].className = "prevMonthDates";
            if (parseInt(daysNames[i].innerHTML) === this._state.currentDay
                && this._state.currentMonth === this._nextMonth().getMonth() + 1
            ) {
                daysNames[i].className = "today";
            }
        }

        // Set correct month date for current month
        for (let i = startOfTheMonth; i <= endOfTheMonth; i++) {
            daysNames[i].innerHTML = daysCounter++;
            daysNames[i].className = "currentMonthDates";
            if (parseInt(daysNames[i].innerHTML) === this._state.currentDay &&
                this._state.currentMonth === (this.date.getMonth() + 1) &&
                this._state.currentYear === this.date.getFullYear()
            ) {
                daysNames[i].className = "today";
                daysNames[i].innerHTML = `${this._state.currentDay}`;
            }
        }
        
        let nextMonthDays = 1;
        
        // Set correct month date for prev month
        for (let i = endOfTheMonth + 1; i < daysNames.length; i++) {
            daysNames[i].innerHTML = nextMonthDays++;
            daysNames[i].className = "nextMonthDates";

            if ((this._state.currentYear) === this.date.getFullYear() - 1) {
                if (parseInt(daysNames[i].innerHTML) === this._state.currentDay
                    && this._state.currentMonth === this._prevMonth()) {
                        if (this._preventWrongMonth) {
                            continue;
                        }   
                        daysNames[i].className = "today";
                        this._preventWrongDate = true; 
                }
            }

            if (parseInt(daysNames[i].innerHTML) === this._state.currentDay
                && this._state.currentMonth === this._prevMonth()
                && this._state.currentYear === this.date.getFullYear() - 1
            ) {
                daysNames[i].className = "today";
            }

            if (parseInt(daysNames[i].innerHTML) === this._state.currentDay
                && this._state.currentMonth === this._prevMonth()
                && this._state.currentYear === this.date.getFullYear())
                {
                    // Prevent from highligting day in same year
                    if (this._preventWrongDate) {
                        continue;
                    } else {
                        daysNames[i].className = "today";
                        this._preventWrongMonth = true;
                    }
                    if (this._state.currentYear === this.date.getFullYear()) {
                        continue;
                    }
                    if (this._preventWrongDate) {
                        continue;
                    }
                    continue;
            }     

        }

        this._setCorrectMonthNames(this._state);
    }
}

Calendar.init(2018, 3);
