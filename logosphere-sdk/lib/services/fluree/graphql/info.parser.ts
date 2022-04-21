import {
  FieldNode,
  FragmentSpreadNode,
  GraphQLResolveInfo,
  Kind,
  SelectionNode,
  SelectionSetNode,
} from 'graphql';
import { SEPARATOR_SLASH, TYPENAME } from './const';

function isFragmentNode(node: SelectionNode): node is FragmentSpreadNode {
  return node?.kind === Kind.FRAGMENT_SPREAD;
}

function isFieldNode(node: SelectionNode): node is FieldNode {
  return node?.kind === Kind.FIELD;
}

function traverseSelections(
  info: GraphQLResolveInfo,
  selectionSet: SelectionSetNode,
  selections: string[],
  parent: string
) {
  //console.log(`in traverse selections: ${JSON.stringify(selectionSet.selections)}`)

  selectionSet?.selections?.map((selection: SelectionNode) => {
    if (isFragmentNode(selection)) {
      traverseSelections(
        info,
        info.fragments[selection.name.value].selectionSet,
        selections,
        parent
      );
    } else if (isFieldNode(selection) && selection.name.value !== TYPENAME) {
      const item =
        parent.length > 0
          ? parent.concat(SEPARATOR_SLASH, selection.name.value)
          : selection.name.value;
      selections.push(item);
      if (selection.selectionSet) {
        traverseSelections(info, selection.selectionSet, selections, item);
      }
    }
  });
}

export type ParsedInfo = { info: { selectionSetList: string[] } };

export function parseInfo(info: GraphQLResolveInfo): ParsedInfo {
  const selections = [];
  const selectionNode = info?.operation?.selectionSet?.selections?.[0];

  if (isFieldNode(selectionNode) && selectionNode.selectionSet) {
    traverseSelections(info, selectionNode.selectionSet, selections, '');
  } else {
    throw Error('No info.operation.selectionSet found');
  }

  return { info: { selectionSetList: selections } };
}

export function parseSelectionSet(info: any, selectionSet: any): ParsedInfo {
  const selections = [];
  traverseSelections(info, selectionSet, selections, '');
  return { info: { selectionSetList: selections } };
}
