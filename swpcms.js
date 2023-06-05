const menuElements = document.getElementsByTagName('swpcms:menu');
const mainElement = document.getElementsByTagName('swpcms:main')[0];

async function setMainElementContent(link) {
  const response = await fetch(link);
  const result = await response.text();
  const parser = new DOMParser();
  const DOM = parser.parseFromString(result, "text/html");
  const targetContent = DOM.querySelector("body").innerHTML;
  if(mainElement.hasChildNodes) {
    mainElement.innerHTML = '';
  }
  mainElement.insertAdjacentHTML("afterbegin", targetContent);
}

async function getJSONData(src) {
  return await fetch('./content/' + src)
        .then((response) => response.json());
}

async function processTags() {
  for (let i = 0; i < menuElements.length; i++) {
    const menuElement = menuElements[i];
    const src = menuElement.getAttribute('src');
    let isSideMenu = src === 'side-menu.json';
    console.log(isSideMenu);
    const menuItemsContent = await getJSONData(src);
    if(i == 0) {
      setMainElementContent(menuItemsContent[0].path);
    }
    const menuItem = menuElement.querySelector('.side-menu-item');
    menuItemsContent.forEach(element => {
      const newMenuItem = menuItem.cloneNode(true);
      const menuItemLink = newMenuItem.querySelector('a');
      const link = menuItemLink;
      const path = element.path;
      const title = element.title;
      link.setAttribute('swpcms:menu-item-id', path);
      link.removeChild(link.childNodes[1]);
      link.textContent = title;
      menuElement.appendChild(newMenuItem);
    });
    menuElement.removeChild(menuElement.childNodes[1])

    const links = menuElement.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', async () => {
          const linkHref = link.getAttribute('swpcms:menu-item-id');
          if(isSideMenu) {
            window.open(linkHref, '_blank');
            return;
          }
          setMainElementContent(linkHref);
        });
      });
  }
}

processTags();