DROP DATABASE Projet_equipe45;
CREATE DATABASE IF NOT EXISTS Projet_equipe45;


use Projet_equipe45;

show tables ;

/*
 ***************************************************
 *         Création des tables entités             *
 ***************************************************
*/

CREATE TABLE IF NOT EXISTS Clients
(
  nom              varchar(45)        NOT NULL,
  adresse_courriel varchar(80) UNIQUE NOT NULL CHECK (adresse_courriel LIKE '%@%.%'),
  mot_de_passe     VARCHAR(100)       NOT NULL CHECK (mot_de_passe REGEXP '^(?=.*[A-Z])(?=.*[!@#$&*])(?=.{8,})'),
  numero_telephone VARCHAR(20)        NOT NULL CHECK (numero_telephone REGEXP '^[+]?[0-9]{8,20}$'),
  adresse          VARCHAR(100)       NOT NULL CHECK (LENGTH(adresse) <= 100),
  DateDeNaissance  date
);


CREATE TABLE IF NOT EXISTS panier 
(
  id_panier INT PRIMARY KEY AUTO_INCREMENT,
  montant_panier DECIMAL(10,2),
  adresse_courriel VARCHAR(80),
  quantite INT,
  FOREIGN KEY (adresse_courriel) REFERENCES Clients(adresse_courriel)
);


CREATE TABLE IF NOT EXISTS commande (
  numero_de_commande INT PRIMARY KEY,
  montant_total DECIMAL(10,2),
  id_panier INT,
  date_de_commande DATE,
  statut_de_livraison enum('livré','sortie pour livraison', 'traitement de la commande'),
  FOREIGN KEY (id_panier) REFERENCES panier(id_panier)
);


CREATE TABLE IF NOT EXISTS fournisseur (
  id_fournisseur INT PRIMARY KEY AUTO_INCREMENT,
  adresse_fournisseur VARCHAR(150),
  
  UNIQUE (id_fournisseur)
);


-- CREATE TABLE IF NOT EXISTS produits (
--   numero_de_reference INT PRIMARY KEY AUTO_INCREMENT,
--   marque VARCHAR(255),
--   nom_du_produit VARCHAR(255),
--   id_fournisseur INT,
--   prix_de_vente DECIMAL(10,2),
--   prix_d_achat DECIMAL(10,2),
--   description TEXT,
--   -- sexe enum('femme', 'homme'),
--   FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur));

-- DROP TABLE produits;

CREATE TABLE IF NOT EXISTS produits (
  numero_de_reference INT PRIMARY KEY AUTO_INCREMENT,
  marque VARCHAR(255),
  nom_du_produit VARCHAR(255),
  prix_de_vente DECIMAL(10,2),
  prix_d_achat DECIMAL(10,2),
  description TEXT,
  sexe enum('femme', 'homme'),
  image VARCHAR(1000),
  UNIQUE (numero_de_reference)
);
-- jn box between product and panier
CREATE TABLE IF NOT EXISTS panier_produits (
  id_panier INT,
  numero_de_reference INT,
  quantite INT,
  PRIMARY KEY (id_panier, numero_de_reference),
  FOREIGN KEY (id_panier) REFERENCES panier(id_panier),
  FOREIGN KEY (numero_de_reference) REFERENCES produits(numero_de_reference)
);

-- TODO MAKE JN TABLES FOR BOTH OF THESE
CREATE TABLE IF NOT EXISTS Vetements (
  numero_de_reference INT PRIMARY KEY,
  type_vetement VARCHAR(50),
  taille VARCHAR(5),
  couleur VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Chaussures (
  numero_de_reference INT PRIMARY KEY,
  pointure INT(2),
  couleur VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS Reviews (
  id_review INT PRIMARY KEY AUTO_INCREMENT,
  note INT CHECK (note >= 0 AND note <= 5),
  numero_de_reference INT,
  commentaire TEXT,
  FOREIGN KEY (numero_de_reference) REFERENCES produits(numero_de_reference)
);

CREATE TABLE IF NOT EXISTS wish_list (
  adresse_courriel VARCHAR(80) PRIMARY KEY,
  numero_de_reference INT,
  FOREIGN KEY (adresse_courriel) REFERENCES Clients(adresse_courriel),
  FOREIGN KEY (numero_de_reference) REFERENCES produits(numero_de_reference)
);


CREATE TABLE IF NOT EXISTS Promotion (
    id_promotion INT NOT NULL AUTO_INCREMENT,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    type_promotion VARCHAR(50) NOT NULL,
    numero_reference INT NOT NULL,
    pourcentage DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (id_promotion),
    FOREIGN KEY (numero_reference) REFERENCES produits (numero_de_reference)
);

CREATE TABLE IF NOT EXISTS ListeReview (
  id_liste_review INT NOT NULL AUTO_INCREMENT,
  review_id INT,
  PRIMARY KEY (id_liste_review),
  FOREIGN KEY (review_id) REFERENCES Reviews (id_review)
);

CREATE TABLE IF NOT EXISTS Facture (
  id_facture INT NOT NULL AUTO_INCREMENT,
  date_et_heure DATETIME,
  statut_payement enum('En attente de payement', 'Payé' ),
  methode_payement enum('credit card', 'PayPal'),
  montant INT NOT NULL,
  PRIMARY KEY (id_facture)
);



ALTER TABLE produits ADD quantite_produit int;



ALTER TABLE produits
    ADD COLUMN fournit INT NOT NULL;

ALTER TABLE ListeReview
    ADD COLUMN evalue INT NOT NULL;

ALTER TABLE Reviews
    ADD COLUMN donne CHAR(80) NOT NULL;

ALTER TABLE Facture
    ADD COLUMN paie varchar(80) NOT NULL;

ALTER TABLE commande
    ADD COLUMN accompli varchar(80) NOT NULL ;

ALTER TABLE produits
    ADD COLUMN promouvoir int;


ALTER TABLE Clients
    ADD COLUMN image VARCHAR(200);

/*
 ***************************************************
 *                CONSTRAINTES            *
 ***************************************************
*/
ALTER TABLE produits
    ADD FOREIGN KEY (promouvoir) REFERENCES Promotion(id_promotion);


ALTER TABLE commande
    ADD FOREIGN KEY (accompli) REFERENCES Clients(adresse_courriel) ON DELETE NO ACTION ;


ALTER TABLE Facture
    ADD FOREIGN KEY (paie) REFERENCES Clients(adresse_courriel) ON DELETE NO ACTION ;



ALTER TABLE produits
    ADD FOREIGN KEY (fournit) REFERENCES fournisseur(id_fournisseur) ON DELETE NO ACTION;

ALTER TABLE ListeReview
    ADD FOREIGN KEY (evalue) REFERENCES produits(numero_de_reference) ON DELETE NO ACTION;


ALTER TABLE Reviews
    ADD FOREIGN KEY (donne) REFERENCES Clients(adresse_courriel) ON DELETE NO ACTION;



ALTER TABLE commande
    ADD FOREIGN KEY (id_panier)
    REFERENCES panier(id_panier)
    ON DELETE CASCADE;


ALTER TABLE ListeReview
    ADD FOREIGN KEY (review_id)
    REFERENCES Reviews(id_review)
    ON DELETE CASCADE;



ALTER TABLE panier
    ADD FOREIGN KEY (adresse_courriel)
    REFERENCES Clients(adresse_courriel)
    ON DELETE CASCADE;



ALTER TABLE Reviews
    ADD FOREIGN KEY (numero_de_reference)
    REFERENCES produits(numero_de_reference)
    ON DELETE CASCADE;

ALTER TABLE wish_list
    ADD FOREIGN KEY (numero_de_reference)
    REFERENCES produits(numero_de_reference)
    ON DELETE CASCADE;

ALTER TABLE Promotion
    ADD FOREIGN KEY (numero_reference)
    REFERENCES produits(numero_de_reference)
    ON DELETE CASCADE;

CREATE TABLE Regroupe (
    numero_reference int,
    adresse_courriel char(80),
    PRIMARY KEY (numero_reference, adresse_courriel),
    FOREIGN KEY (numero_reference)
                      REFERENCES produits(numero_de_reference),
    FOREIGN KEY (adresse_courriel)
                      REFERENCES wish_list(adresse_courriel),
    UNIQUE(adresse_courriel)
);


/*
INSERT ITEMS
*/

INSERT INTO Clients (nom, adresse_courriel, mot_de_passe, numero_telephone, adresse, DateDeNaissance)
VALUES 
  ('Abhi', 'abhi@user.com', 'Abc123!@#', '+1234567890', '123 Main St, Anytown USA', '1990-01-01'),
  ('Jane Smith', 'janesmith@example.com', '123XYZ!@#', '+9876543210', '456 High St, Anytown USA', '1985-05-15');
  
INSERT INTO fournisseur (adresse_fournisseur) VALUES
  ('123 Main St, Anytown, USA'),
  ('456 Market St, Anytown, USA');

INSERT INTO produits (marque, nom_du_produit, prix_de_vente, prix_d_achat, description, sexe, fournit, image)
VALUES 
  ('Adidas', 'Sports Shoes', 79.99, 50.00, 'Mens sports shoes', 'homme', 1, 'https://www.shutterstock.com/image-photo/jeddah-saudi-arabia-september-8-260nw-2038241135.jpg'),
  ('Nike', 'Sport T-shirt', 29.99, 20.00, 'Womens sport T-shirt', 'femme', 2, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmlrZSUyMHNob2V8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60');



/*
 ***************************************************
 *                Création des triggers            *
 ***************************************************
*/
/*
DELIMITER //
CREATE TRIGGER ajout_montant
AFTER INSERT ON panier
FOR EACH ROW
BEGIN
  UPDATE commande SET montant_total = (SELECT SUM(prix_de_vente * quantite) FROM produits INNER JOIN panier ON produits.numero_de_reference = panier.numero_de_reference WHERE panier.id_panier = NEW.id_panier)
  WHERE id_panier = NEW.id_panier;
END;
DELIMITER ;

DELIMITER //
CREATE TRIGGER delete_montant
AFTER DELETE ON panier
FOR EACH ROW
BEGIN
  UPDATE commande SET montant_total = (SELECT SUM(prix_de_vente * quantite) FROM produits INNER JOIN panier ON produits.numero_de_reference = panier.numero_de_reference WHERE panier.id_panier = NEW.id_panier)
  WHERE id_panier = NEW.id_panier;
END;
DELIMITER ;

DELIMITER //
CREATE TRIGGER actualise_panier


 */

