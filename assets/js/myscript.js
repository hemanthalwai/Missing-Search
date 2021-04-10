
// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.


// (function () {
    var INPUTBOX_PLACEHOLDER = 'Enter Text';
    var SEARCH_CONDITION_COUNT = 0;
    var SearchConditionOptions = [
        {
            caption: 'Contains',
            value: 'CONTAINS'
        },
        {
            caption: 'Does not Contain',
            value: 'MISSING'
        }
    ];
    var SpecialSearchConditionOptions = [
        {
            caption: 'None',
            value: 'NONE'
        },
        {
            caption: 'Match Case',
            value: 'MATCH_CASE'
        },
        {
            caption: 'Match Whole Word',
            value: 'MATCH_WHOLE_WORD'
        }
    ];
    class SearchModel {
        searchText;
        condition;
        specialCondition;
        operator;
    }
    const vscode = acquireVsCodeApi();
    function addClass(element, classNames) {
        classNames = classNames.split(' ');
        element.classList.add(...classNames);
    }
    function removeClass(element, classNames) {
        classNames = classNames.split(' ');
        element?.classList?.remove(...classNames);
    }
    function getNewDiv() {
        const div = document.createElement('div');
        return div;
    }
    function getNewButton(text) {
        const btn = document.createElement('button');
        if(text)
            btn.textContent = text;
        return btn;
    }
    function getNewSpan(text) {
        const span = document.createElement('span');
        if(text)
            span.textContent = text;
        return span;
    }
    function getDropdownOptions(type, selectElement) {
        let selectedTypeOptions = [];
        switch(type){
            case 'CONDITION':
                selectElement.id = `condition${SEARCH_CONDITION_COUNT}`;
                selectedTypeOptions = SearchConditionOptions;
                break;
            case 'SPECIAL-CONDITION':
                selectElement.id = `specialCondition${SEARCH_CONDITION_COUNT}`;
                selectedTypeOptions = SpecialSearchConditionOptions;
                break;
        }
        selectedTypeOptions.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.text = item.caption;
            selectElement.appendChild(option);  
        })
    }
    function getNewLabel() {
        const labelElement = document.createElement('label');
        return labelElement;
    }
    function getNewInputBox() {
        const input = document.createElement('input');
        input.type = "text";
        return input;
    }
    function getNewInputCheckbox() {
        const input = document.createElement('input');
        input.type = "checkbox";
        addClass(input, 'user-input');
        return input;
    }
    function getNewDropdown(type) {
        const selectElement = document.createElement('select');
        addClass(selectElement, 'user-input');
        getDropdownOptions(type, selectElement);
        return selectElement;
    }
    function deleteRow(element, rowNumber){
        let id = null;
        if(rowNumber)
            id = rowNumber
        else{
            id = element.target.id;
            id = +id.substr(10);
        }
        const node = document.getElementById(`row${id}`);
        if (node?.parentNode)
            node.parentNode.removeChild(node);
        // const searchContainer = getSearchContainer();
        // const childNodes = document.querySelectorAll('#search-container > div');
        // searchContainer.removeChild(childNodes[id]);
        // --SEARCH_CONDITION_COUNT;
    }
    function generateResultTable(data) {
        const newRows = [];
        data.forEach(data => {
            const tr = getNewTableRow();
            tr.appendChild(getColumn1(data));
            tr.appendChild(getNewTableCell('Test'));
            tr.appendChild(getNewTableCell('Test'));
            newRows.push(tr);
        })
        return newRows;
    }
    function getNewTableCell(text) {
        const td = document.createElement('td');
        if(text)
            td.textContent = text;
        return td;
    }
    function getColumn1(data) {
        const td = getNewTableCell();
        td.appendChild(getExpandableSearchResult(data));
        return td;
    }
    function getExpandableSearchResult(data) {
        let {fileName, filematches } = '';
        const file = data.find(x => x.type === 'begin');
        const matches = data.find(x => x.type === 'match');
        if(file){
            fileName = file?.data?.path?.text;
            filematches = matches?.data?.lines?.text;
        }
        const detailsElement = document.createElement('details');
        const summary = document.createElement('summary');
        const span = getNewSpan();
        summary.textContent = fileName || '';
        const startIndex = matches?.data?.submatches[0]?.start;
        const lastIndex = matches?.data?.submatches[0]?.end;
        const matchingLine = matches?.data?.lines?.text;
        const matchingString = matchingLine.substring(startIndex, lastIndex);
        addClass(span, 'bg-orange');
        detailsElement.innerHTML = `${matchingLine.substring(0, startIndex)} <p class='bg-orange'>${matchingString}</p>${matchingLine.substring(lastIndex)}`;
        detailsElement.appendChild(summary);
        return detailsElement;
    }
    function getNewTableRow(){
        return document.createElement('tr');
    }
    function getSearchResultTableElement() {
        return document.getElementById('search-result-table');
    }
    function getDeleteIcon() {
        const divElement = document.createElement('div');
        addClass(divElement, 'item');
        divElement.style = 'align-self: center;margin: auto 0;';
        const btnElement = getNewButton('X');
        btnElement.id = `deleteIcon${SEARCH_CONDITION_COUNT}`;
        addClass(btnElement, 'delete-icon');
        btnElement.addEventListener('click', deleteRow);
        divElement.appendChild(btnElement);
        return divElement;
    }
    function getSearchContainer() {
        const searchContainer = document.getElementById('search-container');
        return searchContainer; 
    }
    function getSearchConditionDropdown() {
        const childdiv = getNewDiv();
        addClass(childdiv, 'item');
        const inputBox = getNewInputBox();
        inputBox.placeholder = INPUTBOX_PLACEHOLDER;
        inputBox.id = `s${SEARCH_CONDITION_COUNT}`;
        childdiv.appendChild(inputBox);
        return childdiv;
    }
    function getSearchInputBox() {
        const childdiv = getNewDiv();
        addClass(childdiv, 'item');
        const inputBox = getNewInputBox();
        inputBox.placeholder = INPUTBOX_PLACEHOLDER;
        inputBox.id = `s${SEARCH_CONDITION_COUNT}`;
        addClass(inputBox, 'user-input');
        childdiv.appendChild(inputBox);
        return childdiv;
    }
    function setValue(element, value) {
        element.value = value;
    }
    function getLastRowInput() {
        return getSearchContainer().lastChild;
    }
    function getLastRowNumberInput(){
        const lastRow = getLastRowInput();
        const rowNumberStr = lastRow?.id?.substr(3) || null;
        return +rowNumberStr;
    }
    function getDeleteIconForLastRow(){
        const rowNumber = getLastRowNumberInput();
        return document.getElementById(`deleteIcon${rowNumber}`);
    }
    function getOperatorToggleForLastRow(){
        const rowNumber = getLastRowNumberInput();
        return document.getElementById(`operatorContainer${rowNumber}`);
    }
    function getOperatorToggle() {
        const labelElement = getNewLabel();
        addClass(labelElement, 'switch');
        const checkboxElement = getNewInputCheckbox();
        addClass(checkboxElement, 'user-input hidden');
        setValue(checkboxElement, 'AND');
        checkboxElement.checked = true;
        checkboxElement.id = `operator${SEARCH_CONDITION_COUNT}`;
        labelElement.appendChild(checkboxElement);
        const sliderDiv = getNewDiv();
        addClass(sliderDiv, 'slider round');
        let childSpan = getNewSpan('AND');
        addClass(childSpan, 'on');
        sliderDiv.appendChild(childSpan);
        childSpan = getNewSpan('OR');
        addClass(childSpan, 'off');
        sliderDiv.appendChild(childSpan);
        labelElement.appendChild(sliderDiv);
        return labelElement;
    }
    function enableOperator() {
        const operatorContanier = getOperatorToggleForLastRow();
        removeClass(operatorContanier, 'hidden');
    }
    function addSearchContainer() {
        console.log('IN add search');
        const searchContainer = getSearchContainer();
        enableOperator();
        const rowdiv = getNewDiv();
        addClass(rowdiv , 'container row space-around top');
        rowdiv.id = `row${++SEARCH_CONDITION_COUNT}`;
        let childdiv = getSearchInputBox();
        rowdiv.appendChild(childdiv);
        
        childdiv = getNewDiv();
        childdiv.appendChild(getNewDropdown('CONDITION'));
        rowdiv.appendChild(childdiv);

        childdiv = getNewDiv();
        childdiv.appendChild(getNewDropdown('SPECIAL-CONDITION'));
        rowdiv.appendChild(childdiv);

        childdiv = getNewDiv();
        childdiv.id = `operatorContainer${SEARCH_CONDITION_COUNT}`;
        let toggleElement = getOperatorToggle();
        addClass(childdiv, 'hidden');
        childdiv.appendChild(toggleElement);
        rowdiv.appendChild(childdiv);

        const deleteIcon = getDeleteIcon();
        rowdiv.appendChild(deleteIcon);
        searchContainer.appendChild(rowdiv);

    }

    function applySearch() {
        var criterias = document.querySelectorAll('.user-input');
        console.log(criterias);
        const userInputs = [];
        for(let i=0; i< criterias.length; i= i+4 ){
            const searchModel = new SearchModel();
            searchModel.searchText = criterias[i].value;
            searchModel.condition = criterias[i+1].value;
            searchModel.specialCondition = criterias[i+2].value;
            searchModel.operator = criterias[i+3].value;
            userInputs.push(searchModel);
        }
        console.log('userInputs', userInputs); 
        vscode.postMessage({command: 'search', data: userInputs});       
    }
    function getResultSection() {
        return document.getElementById('result-section');
    }
    function showResultSection(){
        const resultSection = getResultSection();
        removeClass(resultSection, 'hidden');
    }
    function hideResultSection(){
        const resultSection = getResultSection();
        addClass(resultSection, 'hidden');
    }
    function setResult(data) {
        const results = data.resultArray;
        const tbody = getSearchResultTableElement();
        while (tbody?.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        const newrows = generateResultTable(results);
        newrows.forEach(x => tbody.appendChild(x));
        if(data){
            const resultSection = getResultSection();
            removeClass(resultSection, 'hidden');
        }
    }
    function registerKeyDownEvent(element, callback) {
        element.addEventListener('keyup', callback);
    }
    function submitIfEnter(event){
        if (event?.which == 13 || event?.keyCode == 13)
            document.getElementById('searchButton').click();
    }

    function resetAllFields() {
        var criterias = document.querySelectorAll('.user-input');
        for(let i=0; i< criterias.length; i= i+4 ){
            criterias[i].value = '';
            criterias[i+1].value = 'CONTAINS';
            criterias[i+2].value = 'NONE';
        }
        document.getElementById('s0').focus();
    }
    console.log('Js exec');
    document.getElementById('addBtn').addEventListener('click', () => {
        addSearchContainer();
    });
    document.getElementById('searchButton').addEventListener('click', () => {
        applySearch();
    });
    document.getElementById('cancelButton').addEventListener('click', () => {
        hideResultSection();
        for(let i= 1; i <= SEARCH_CONDITION_COUNT; i++){
            deleteRow(null, i);
            resetAllFields();
        }
    });

    registerKeyDownEvent(document.getElementById('s0'), submitIfEnter);
    document.getElementById('s0').focus();
    window.addEventListener('message', (message) => {
        setResult(message.data);
    })    
