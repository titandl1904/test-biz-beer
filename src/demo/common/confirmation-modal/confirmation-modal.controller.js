class ConfirmationModalController {

	/**
	 * Cancel confirmation, closing modal
	 *
	 */
	cancel() {
		this.modalInstance.dismiss();
	}

	/**
	 * Submit the form and delete if confirmed.
	 *
	 */
	submit() {
		this.modalInstance.close();
	}
}

export default ConfirmationModalController;
