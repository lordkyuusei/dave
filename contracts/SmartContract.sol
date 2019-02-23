pragma solidity >=0.4.21 <0.6.0;

contract SmartContract
{
    // Un dictionnaire d'adresses de compte & de montants
    mapping(address => uint256) kvpBalances;

    // Le "titre" du contrat.
    string public constant name = "EPICOIN";
    // Le "symbole" du contrat.
    string public constant symbol = "EPC";
    // Le nombre minimal de "monnaie" que le contrat peut recevoir à la création.
    uint8 public constant decimals = 18;

    uint256 totalSupply;

    event Transfer(address indexed you, address indexed receiver, uint256 amount);

    constructor (uint256 initialSupply, address owner) public
    {
        totalSupply = initialSupply;
        kvpBalances[owner] = initialSupply;
        emit Transfer(address(0), owner, initialSupply);
    }

    // view ~= constant. Fonction pure et fonctionelle, sans effet de bord. Getter de totalSupply
    function getTotalSupply() public view returns (uint256)
    {
        return totalSupply;
    }

    function getBalanceOf(address owner) public view returns (uint256) {
        return kvpBalances[owner];
    }

    /*
    * Méthode pour envoyer un montant à une addresse.
    * On vérifie que l'envoyeur n'est pas le receveur, et que son solde est suffisant.
    * On déduit la somme de la balance de l'envoyeur, on l'ajoute au solde du receveur.
    * On appelle Transfer 
    */
    function sendAmount(address receiver, uint256 amount) public returns (bool) {
        require(receiver != address(0), "Pas de dédoublement de personnalité");
        require(amount <= getBalanceOf(msg.sender), "Pas assez de flouze");

        kvpBalances[msg.sender] -= amount;
        kvpBalances[receiver] += amount;

        emit Transfer(msg.sender, receiver, amount);
        return true;
    }
}