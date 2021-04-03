describe('Comportamentos do app', () => {

    beforeEach(() => {
        cy.log('Limpando storage');
        window.localStorage.clear();
    })
    
    it ('Deve mostrar tarefas se ao abrir ter tarefas no localstorage', () => {

        // DADO        
        window.localStorage.setItem('tarefas_todo','[{"desc":"Tarefa 1","isFeito":false}]')
        
        // QUANDO
        cy.visit('http://127.0.0.1:8080')

        // ENTAO
        cy.get(':nth-child(5) > .list-group-item > .row > .col-10 > span').should('have.text', 'Tarefa 1')
    });

    it ('Deve mostrar a frase que nao tem atividades', () => {

        // DADO        
        window.localStorage.setItem('tarefas_todo','[{"desc":"tarefa 1","isFeito":false}]')
        
        // QUANDO
        cy.visit('http://127.0.0.1:8080')
        cy.get('#button-addon3').click()

        // ENTAO
        cy.get('.sem-atividade').should('have.text', 'Sem atividades por hoje!')
    });

    it ('Deve limpar lista de tarefas no localstorage', () => {
        
        // DADO
        window.localStorage.setItem('tarefas_todo','[{"desc":"tarefa 1","isFeito":false}]')
        
        // QUANDO
        cy.visit('http://127.0.0.1:8080')

        // ENTAO
        cy.get('#button-addon3').click().should(() => {
            expect(window.localStorage.getItem('tarefas_todo')).to.eq('[]')
        });
    });

    it ('Adiciona DUAS tarefas na lista', () => {
        
        // DADO
        cy.clearLocalStorage()
        
        // QUANDO
        cy.visit('http://127.0.0.1:8080')

        cy.get('.form-control').type('Tarefa 1 de teste')
        cy.get('#button-addon2').click()

        cy.get('.form-control').type('Tarefa 2')
        cy.get('#button-addon2').click()

        // ENTAO
        cy.get(':nth-child(5) > .list-group-item > .row > .col-10 > span').should('have.text', 'Tarefa 1 de teste')
        cy.get(':nth-child(6) > .list-group-item > .row > .col-10 > span').should('have.text', 'Tarefa 2')
    });

    it ('Nao faz nada quando clicar para adicionar se campo estiver vazio', () => {
        
        // DADO
        window.localStorage.removeItem('tarefas_todo')
        
        // QUANDO
        cy.visit('http://127.0.0.1:8080')
        cy.get('#button-addon2').click()

        // ENTAO
        cy.get('.sem-atividade').should('have.text', 'Sem atividades por hoje!')
        expect(window.localStorage.getItem('tarefas_todo')).to.be.null
    });

    it ('Marca a atividade como feita', () => {
        
        // DADO
        window.localStorage.setItem('tarefas_todo','[{"desc":"tarefa 1 feita","isFeito":false}]')
        
        // QUANDO
        cy.visit('http://127.0.0.1:8080')
        cy.get('.list-group-item').click()

        // ENTAO
        cy.get('.list-group-item').should('have.class', 'tarefa-feita')

        setInterval(() => {
            const tarefa = JSON.parse(window.localStorage.getItem('tarefas_todo'))[0]
            
            expect(tarefa['desc'].to.equal('tarefa 1 feita'))
            expect(tarefa['isFeito']).to.be.true
        }, 1000);
    });

    //TODO teste para excluir tarefa da lista
});