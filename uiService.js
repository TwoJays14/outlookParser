import {userData} from "./index.js";
import {getMessage, searchPromotions} from "./emailService.js";

const bodyElement = document.querySelector('body');
const tableBodyElement = document.getElementById('table-body');
const searchElement = document.querySelector('#search');

export function attachTableRowEventListeners() {
  document.querySelectorAll('.view-more').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await displayMessage(btn.dataset.promotionId);
      document.getElementById('my_modal_2').showModal();
    })
  });
}

export function createModalDialogElement() {
  bodyElement.insertAdjacentHTML('beforeend',
    `
        <dialog id="my_modal_2" class="modal modal-bottom sm:modal-middle">
     <div class="modal-box w-11/12 max-w-5xl">
    <h3 class="text-lg font-bold modal-header"></h3>
    <p class="py-4 modal-text-1"></p>
  </div>
</dialog>  
      `
  )
}

export async function displayMessage(emailSender) {
  const promotion = userData.promotions.find(promotion => promotion.emailId.trim() === emailSender.trim());


  if(!promotion) {
    throw new Error("Promotion not found");
  }

  await getMessage(promotion);

  const modalHeaderElement = document.querySelector('.modal-header');
  const modalText1Element = document.querySelector('.modal-text-1');

  modalHeaderElement.innerText = `${promotion.sender}`;
  modalText1Element.innerHTML = `${promotion.messageContent}`;

}

export function setupSearchEventListener() {
  searchElement.addEventListener('input', (e) => {
    searchPromotions(e.target.value)
  })
}

export function renderTable(searchResult) {
  if(searchResult.length <= 0) {
    throw new Error("There are no items in this list");
  }

  tableBodyElement.innerHTML = '';

  searchResult.forEach((promotion, i) => {
    tableBodyElement.insertAdjacentHTML('beforeend',
      `
       <tr class="view-more cursor-pointer" data-promotion-id=${promotion.emailId}>
            <td>${i + 1}</td>
            <td>${promotion.sender}</td>
            <td>${promotion.subject}</td>
            <td>${promotion.receivedAt}</td>
        </tr>
      `
    )
  });

  attachTableRowEventListeners();
}