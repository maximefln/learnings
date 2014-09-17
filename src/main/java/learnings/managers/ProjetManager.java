package learnings.managers;

import java.util.List;

import learnings.dao.ProjetDao;
import learnings.dao.RessourceDao;
import learnings.dao.impl.ProjetDaoImpl;
import learnings.dao.impl.RessourceDaoImpl;
import learnings.model.Projet;

public class ProjetManager {

	private static ProjetManager instance;

	public static ProjetManager getInstance() {
		if (instance == null) {
			instance = new ProjetManager();
		}
		return instance;
	}

	private ProjetDao projetDao = new ProjetDaoImpl();
	private RessourceDao ressourceDao = new RessourceDaoImpl();

	public List<Projet> listerProjets() {
		return projetDao.listerProjets();
	}

	public Projet getProjetAvecRessources(Long idProjet) {
		if (idProjet == null) {
			throw new IllegalArgumentException("L'identifiant du projet est nul.");
		}
		Projet projet = projetDao.getProjet(idProjet);
		projet.setRessources(ressourceDao.getRessources(projet));

		return projet;
	}

	public void ajouterProjet(Projet projet) {
		if (projet == null) {
			throw new IllegalArgumentException("Le projet est null.");
		}
		if (projet.getTitre() == null || "".equals(projet.getTitre())) {
			throw new IllegalArgumentException("Le titre du projet doit être renseigné.");
		}
		if (projet.getDateLimiteRenduLot1() == null || projet.getDateLimiteRenduLot2() == null) {
			throw new IllegalArgumentException("Les dates de limite de rendu des deux lots doivent être renseignées.");
		}
		projetDao.ajouterProjet(projet);
	}

	public void modifierProjet(Projet projet) {
		if (projet == null) {
			throw new IllegalArgumentException("Le projet est null.");
		}
		if (projet.getId() == null) {
			throw new IllegalArgumentException("L'identifiant du projet doit être renseigné.");
		}
		if (projet.getTitre() == null || "".equals(projet.getTitre())) {
			throw new IllegalArgumentException("Le titre du projet doit être renseigné.");
		}
		if (projet.getDateLimiteRenduLot1() == null || projet.getDateLimiteRenduLot2() == null) {
			throw new IllegalArgumentException("Les dates de limite de rendu des deux lots doivent être renseignées.");
		}
		projetDao.modifierProjet(projet);
	}
}
