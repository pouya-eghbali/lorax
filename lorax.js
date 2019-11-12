export default class Lorax {
  constructor(el) {
    this.el = el
    this.data = {}
    this.initDom()
    this.initMenu()
    this.initDrag()
    this.installMenu()
  }
  initDom() {
    this.root = this.makeNode()
    this.root.classList.add('lorax-root-node')
    this.el.appendChild(this.root)
  }
  makeNode() {
    const node = document.createElement('div')
    node.classList.add('lorax-node')
    node.setAttribute('draggable', true)
    node.innerHTML = '<a class="lorax-node-display" data-value="node"> node </a>'
    node.innerHTML += '<div class="lorax-child-nodes"></div>'
    node.addEventListener('dragstart', this.drag)
    node.addEventListener('dragover', this.dragOver)
    node.addEventListener('dragenter', this.dragEnter)
    node.addEventListener('dragleave', this.dragLeave)
    node.addEventListener('drop', this.drop)
    return node
  }
  initMenu() {
    this.menu = document.createElement('div')
    this.menu.classList.add('lorax-menu')
    this.addBtn = document.createElement('a')
    this.addBtn.innerText = 'Add'
    this.addBtn.classList.add('lorax-add-btn')
    this.removeBtn = document.createElement('a')
    this.removeBtn.classList.add('lorax-remove-btn')
    this.removeBtn.innerText = 'Remove'
    this.menu.appendChild(this.addBtn)
    this.menu.appendChild(this.removeBtn)
    this.el.appendChild(this.menu)
  }
  installMenu() {
    this.el.addEventListener('contextmenu', event => {
      event.preventDefault()
      this.target = event.target.closest('.lorax-node')
      const { pageX, pageY } = event
      const { left: deltaX, height: deltaH } = this.el.getBoundingClientRect()
      this.openMenu(pageX - deltaX, pageY - deltaH + 50)
    })
    this.addBtn.addEventListener('click', event => {
      this.addNodeToTarget()
      this.closeMenu()
    })
    this.removeBtn.addEventListener('click', event => {
      this.removeTargetNode()
      this.closeMenu()
    })
    this.el.addEventListener('click', event => {
      this.closeMenu()
    })
  }
  addNodeToTarget() {
    const node = this.makeNode()
    this.target.querySelector('.lorax-child-nodes').appendChild(node)
    return node
  }
  removeTargetNode() {
    this.target.remove()
  }
  openMenu(left, right) {
    this.menu.style.left = left + 'px'
    this.menu.style.top = right + 'px'
    this.menu.classList.remove('lorax-menu-closed')
    this.menu.classList.add('lorax-menu-open')
  }
  closeMenu() {
    if (this.menu.classList.contains('lorax-menu-open')) {
      this.menu.classList.add('lorax-menu-closed')
      this.menu.classList.remove('lorax-menu-open')
    }
  }
  initDrag() {

  }
  drag(event) {
    event.dataTransfer.setData('text/plain', '');
    this.dragSrc = event.target.closest('.lorax-node');
  }
  dragOver(event) {
    event.preventDefault()
  }
  dragEnter(event) {
    event.target.closest('.lorax-node').classList.add('lorax-drag-enter')
  }
  dragLeave(event) {
    event.target.closest('.lorax-node').classList.remove('lorax-drag-enter')
  }
  drop(event) {
    this.dragDest = event.target.closest('.lorax-node')
    const childNodes = this.dragDest ?
      this.dragDest.querySelector('.lorax-child-nodes') : null
    if (this.dragDest && childNodes && this.dragSrc)
      childNodes.appendChild(this.dragSrc)
    this.dragDest.classList.remove('lorax-drag-enter')
  }
  value(el) {
    const parent = el || this.root
    const { value } = parent.querySelector('.lorax-node-display').dataset
    const { childNodes } = parent.querySelector('.lorax-child-nodes')
    const children = [...childNodes].map(el => this.value(el))
    return { value, children }
  }
  setNodeValue(node, value) {
    const display = node.querySelector('.lorax-node-display')
    display.dataset.value = value
  }
  restore(values, node) {
    const parent = node || this.root
    const { value, children } = values
    this.setNodeValue(parent, value)
    if (!children) return
    children.forEach(values => {
      this.target = parent
      const node = this.addNodeToTarget()
      this.restore(values, node)
    })
  }
}
