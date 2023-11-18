function alertModal(modalContent) {
    return `
        <!-- Alert Modal -->
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body" style="background-color:#f8d7da !important; color: #58151c; border:1px solid #f1aeb5; border-radius: 0.375rem; transform: rotate(0.04deg);">
                    ${modalContent}
                </div>
            </div>
        </div>
    `
}