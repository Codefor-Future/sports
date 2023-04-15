DROP DATABASE projet_equipe45;
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
  DateDeNaissance  date,
  sexe enum('femme', 'homme'),
);


CREATE TABLE IF NOT EXISTS panier (
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
  adresse_fournisseur VARCHAR(150)
);


CREATE TABLE IF NOT EXISTS produits (
  numero_de_reference INT PRIMARY KEY AUTO_INCREMENT,
  marque VARCHAR(255),
  nom_du_produit VARCHAR(255),
  id_fournisseur INT,
  prix_de_vente DECIMAL(10,2),
  prix_d_achat DECIMAL(10,2),
  description TEXT,
  sexe enum('femme', 'homme'),
  FOREIGN KEY (id_fournisseur) REFERENCES fournisseur(id_fournisseur));

DROP TABLE produits;

CREATE TABLE IF NOT EXISTS produits (
  numero_de_reference INT PRIMARY KEY AUTO_INCREMENT,
  marque VARCHAR(255),
  nom_du_produit VARCHAR(255),
  prix_de_vente DECIMAL(10,2),
  prix_d_achat DECIMAL(10,2),
  description TEXT,
  sexe enum('femme', 'homme')
);

CREATE TABLE IF NOT EXISTS Vetements (
  numero_de_reference INT PRIMARY KEY,
  type_vetement VARCHAR(50),
  taille VARCHAR(5),
  couleur VARCHAR(50),
  FOREIGN KEY (numero_de_reference) REFERENCES produits(numero_de_reference)
);

CREATE TABLE IF NOT EXISTS Chaussures (
  numero_de_reference INT PRIMARY KEY,
  pointure INT(2),
  couleur VARCHAR(50),
  FOREIGN KEY (numero_de_reference) REFERENCES produits(numero_de_reference)
);

CREATE TABLE IF NOT EXISTS reviews (
  id_review INT PRIMARY KEY AUTO_INCREMENT,
  note INT CHECK (note >= 0 AND note <= 5),   #
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

ALTER TABLE reviews
    ADD COLUMN donne CHAR(80) NOT NULL;

ALTER TABLE Facture
    ADD COLUMN paie varchar(80) NOT NULL;

ALTER TABLE commande
    ADD COLUMN accompli varchar(80) NOT NULL ;

ALTER TABLE produits
    ADD COLUMN promouvoir int;


ALTER TABLE clients
    ADD COLUMN image VARCHAR(200);

/*
 ***************************************************
 *                CONSTRAINTES            *
 ***************************************************
*/
ALTER TABLE produits
    ADD CONSTRAINT promouvoir
    FOREIGN KEY(promouvoir) REFERENCES promotion(id_promotion);


ALTER TABLE commande
    ADD CONSTRAINT accompli
    FOREIGN KEY (accompli) REFERENCES clients(adresse_courriel) ON DELETE NO ACTION ;


ALTER TABLE facture
    ADD CONSTRAINT paie
    FOREIGN KEY (paie) REFERENCES clients(adresse_courriel) ON DELETE NO ACTION ;



ALTER TABLE produits
    ADD CONSTRAINT fournir
    FOREIGN KEY (fournit) REFERENCES fournisseur(id_fournisseur) ON DELETE NO ACTION;

ALTER TABLE listereview
    ADD CONSTRAINT evalue
    FOREIGN KEY (evalue) REFERENCES produits(numero_de_reference) ON DELETE NO ACTION;


ALTER TABLE reviews
    ADD CONSTRAINT donne
    FOREIGN KEY (donne) REFERENCES clients(adresse_courriel) ON DELETE NO ACTION;



ALTER TABLE Commande
    ADD CONSTRAINT id_panier
    FOREIGN KEY (id_panier)
    REFERENCES panier(id_panier)
    ON DELETE CASCADE;


ALTER TABLE ListeReview
    ADD CONSTRAINT review_id
    FOREIGN KEY (review_id)
    REFERENCES reviews(id_review)
    ON DELETE CASCADE;



ALTER TABLE panier
    ADD CONSTRAINT addresse_courriel
    FOREIGN KEY (adresse_courriel)
    REFERENCES clients(adresse_courriel)
    ON DELETE CASCADE;



ALTER TABLE reviews
    ADD CONSTRAINT numero_ref
    FOREIGN KEY (numero_de_reference)
    REFERENCES produits(numero_de_reference)
    ON DELETE CASCADE;

ALTER TABLE wish_list
    ADD CONSTRAINT num_ref
    FOREIGN KEY (numero_de_reference)
    REFERENCES produits(numero_de_reference)
    ON DELETE CASCADE;

ALTER TABLE Promotion
    ADD CONSTRAINT numm_ref
    FOREIGN KEY (numero_reference)
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

