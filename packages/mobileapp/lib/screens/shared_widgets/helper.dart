import 'package:flutter/material.dart';

/// Widget that help to correctly show elements that require
/// Material parent widget on iOS.
class MaterialWidget extends StatelessWidget {
  const MaterialWidget({Key? key, required this.child}) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: child,
    );
  }
}

/// Widget that add on left and right.
class SidePadding extends StatelessWidget {
  const SidePadding({Key? key, required this.child}) : super(key: key);

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        // horizontal: ScreenUtil().setWidth(40),
        horizontal: 10,
      ),
      child: child,
    );
  }
}
